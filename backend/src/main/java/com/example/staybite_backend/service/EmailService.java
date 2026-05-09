package com.example.staybite_backend.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Placeholder for JavaMailSender
    // @Autowired private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String hotelName, String roomType) {
        System.out.println("Mock Email Sent to: " + toEmail);
        System.out.println("Subject: Booking Confirmed at " + hotelName);
        System.out.println("Body: Your " + roomType + " is confirmed. Enjoy your stay!");
    }

    public void sendOrderUpdate(String toEmail, String status) {
        System.out.println("Mock Email Sent to: " + toEmail);
        System.out.println("Subject: Order Status Update");
        System.out.println("Body: Your order is now " + status);
    }
}
