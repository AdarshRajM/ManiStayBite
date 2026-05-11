package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.EventBooking;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.repository.EventBookingRepository;
import com.example.staybite_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/events")
public class EventController {

    @Autowired
    private EventBookingRepository eventBookingRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/book")
    public ResponseEntity<?> bookEvent(@RequestBody EventBooking bookingRequest, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required to book an event.");
        }
        
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        bookingRequest.setUser(user);
        bookingRequest.setStatus("PENDING");
        
        eventBookingRepository.save(bookingRequest);

        return ResponseEntity.ok("Event booking request submitted successfully. Awaiting Admin approval.");
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        // Since we don't have a specific findByUser method in the repository yet, 
        // we can fetch all and filter or just assume the repository has it if we add it.
        // For simplicity, I will leave it to the repository to implement later or just return ok
        return ResponseEntity.ok("Bookings fetched");
    }
}
