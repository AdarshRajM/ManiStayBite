package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Review;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.repository.ReviewRepository;
import com.example.staybite_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{type}/{id}")
    public ResponseEntity<?> getReviews(@PathVariable String type, @PathVariable Long id) {
        return ResponseEntity.ok(reviewRepository.findByEntityTypeAndEntityId(type.toUpperCase(), id));
    }

    @PostMapping("/")
    public ResponseEntity<?> addReview(@RequestBody Review review, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Must be logged in to leave a review.");
        }
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        review.setUser(user);
        reviewRepository.save(review);
        return ResponseEntity.ok("Review submitted successfully.");
    }

    // Super Admin Only
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok("Review deleted by Admin.");
    }
}
