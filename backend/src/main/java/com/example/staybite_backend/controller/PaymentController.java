package com.example.staybite_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, String>> initiatePayment(@RequestParam String method, @RequestParam Double amount) {
        Map<String, String> response = new HashMap<>();
        if ("UPI".equalsIgnoreCase(method)) {
            response.put("status", "SUCCESS");
            response.put("transactionId", "UPI-" + System.currentTimeMillis());
            response.put("message", "UPI Payment of INR " + amount + " successful.");
        } else if ("CARD".equalsIgnoreCase(method)) {
            response.put("status", "SUCCESS");
            response.put("transactionId", "CARD-" + System.currentTimeMillis());
            response.put("message", "Credit/Debit Card Payment of INR " + amount + " successful.");
        } else {
            response.put("status", "FAILED");
            response.put("message", "Unsupported payment method: " + method);
        }
        return ResponseEntity.ok(response);
    }
}
