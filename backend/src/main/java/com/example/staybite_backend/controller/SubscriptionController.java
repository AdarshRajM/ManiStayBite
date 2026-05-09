package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Subscription;
import com.example.staybite_backend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Subscription> getHotelSubscription(@PathVariable Long hotelId) {
        return subscriptionRepository.findByHotelId(hotelId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/purchase")
    public ResponseEntity<Subscription> purchaseSubscription(@RequestBody Subscription subscription) {
        subscription.setValidUntil(LocalDateTime.now().plusMonths(1));
        subscription.setStatus("ACTIVE");
        return ResponseEntity.ok(subscriptionRepository.save(subscription));
    }
}
