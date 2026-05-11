package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.ServiceRequest;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.repository.ServiceRequestRepository;
import com.example.staybite_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/services")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/book")
    public ResponseEntity<?> bookService(@RequestBody ServiceRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        request.setUser(user);
        request.setStatus("PENDING");
        
        serviceRequestRepository.save(request);

        return ResponseEntity.ok("Service booked successfully! Awaiting confirmation.");
    }
}
