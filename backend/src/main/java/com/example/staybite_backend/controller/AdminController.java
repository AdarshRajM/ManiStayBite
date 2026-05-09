package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.EventBooking;
import com.example.staybite_backend.repository.EventBookingRepository;
import com.example.staybite_backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EventBookingRepository eventBookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Welcome to the Super Admin Dashboard! Only SUPER_ADMIN can see this.");
    }

    // --- EVENT MANAGEMENT ---
    @GetMapping("/events/pending")
    public ResponseEntity<List<EventBooking>> getPendingEvents() {
        // Mock returning all for simplicity
        return ResponseEntity.ok(eventBookingRepository.findAll());
    }

    @PutMapping("/events/{id}/approve")
    public ResponseEntity<?> approveEvent(@PathVariable Long id) {
        EventBooking event = eventBookingRepository.findById(id).orElseThrow();
        event.setStatus("APPROVED");
        eventBookingRepository.save(event);
        return ResponseEntity.ok("Event approved.");
    }

    // --- REVIEW MANAGEMENT ---
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok("Review deleted.");
    }
}
