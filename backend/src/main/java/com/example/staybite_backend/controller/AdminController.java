package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.EventBooking;
import com.example.staybite_backend.entity.Role;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.repository.EventBookingRepository;
import com.example.staybite_backend.repository.ReviewRepository;
import com.example.staybite_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EventBookingRepository eventBookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Welcome to the Super Admin Dashboard! Only SUPER_ADMIN can see this.");
    }

    @PostMapping("/owners")
    public ResponseEntity<?> createHotelOwner(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Owner email is required.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use.");
        }

        User owner = new User();
        owner.setName(request.getOrDefault("name", "Hotel Owner"));
        owner.setEmail(email);
        owner.setPassword(passwordEncoder.encode(request.getOrDefault("password", "owner123")));
        owner.setRole(Role.HOTEL_OWNER);
        owner.setMobile(request.get("mobile"));
        owner.setAadhaar(request.get("aadhaar"));

        User savedOwner = userRepository.save(owner);
        return ResponseEntity.ok(savedOwner);
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
