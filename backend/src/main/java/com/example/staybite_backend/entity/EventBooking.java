package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String eventType; // "Wedding", "Birthday", "Ring Ceremony", "Corporate", etc.
    private Integer guests;
    
    private String area; // "Entire Hotel", "Banquet Hall", "Pool Area", "Rooftop"
    
    private LocalDateTime bookingDate;

    private String cateringPackage; // "Veg", "Non-Veg", "Premium Buffet", "Live Counter"
    private String decorationPackage; // "Basic", "Premium", "Royal Theme", "Floral"
    
    private String additionalServices; // Comma separated: "DJ,Photography,Videography,Security"

    private Double estimatedCost;
    private Double advancePaid;

    private String status; // "PENDING", "APPROVED", "REJECTED"
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
