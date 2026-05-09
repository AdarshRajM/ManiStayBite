package com.example.staybite_backend.service;

import org.springframework.stereotype.Service;

@Service
public class AiFraudDetectionService {

    public boolean isReviewSpam(String reviewContent) {
        // Mock AI logic: Flag reviews containing specific spam keywords
        String lowerCaseReview = reviewContent.toLowerCase();
        return lowerCaseReview.contains("click here") || 
               lowerCaseReview.contains("free money") || 
               lowerCaseReview.contains("crypto");
    }

    public boolean isSuspiciousBooking(Long userId, int bookingsToday) {
        // Mock AI logic: Flag users making more than 5 bookings in a single day
        return bookingsToday > 5;
    }
}
