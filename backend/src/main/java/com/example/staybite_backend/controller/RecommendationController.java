package com.example.staybite_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/recommendations")
public class RecommendationController {

    @GetMapping("/food")
    public ResponseEntity<?> getFoodRecommendations() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "AI Smart Recommendation");
        response.put("items", Arrays.asList(
                Map.of("id", 1, "name", "Spa & Wellness Package", "reason", "Customers who booked Deluxe Room also booked Spa."),
                Map.of("id", 2, "name", "Rasmalai", "reason", "Popular pairing with Paneer Tikka based on user behavior.")
        ));
        return ResponseEntity.ok(response);
    }
}
