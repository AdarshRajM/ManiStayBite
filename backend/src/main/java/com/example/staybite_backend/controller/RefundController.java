package com.example.staybite_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {

    @PostMapping("/process/{orderId}")
    public ResponseEntity<String> processRefund(@PathVariable Long orderId, @RequestParam Double amount) {
        // Mock Smart Refund Integration
        String responseMessage = String.format("Smart Refund of INR %.2f initiated successfully for Order ID: %d. Funds will reflect in the customer's Wallet instantly.", amount, orderId);
        return ResponseEntity.ok(responseMessage);
    }
}
