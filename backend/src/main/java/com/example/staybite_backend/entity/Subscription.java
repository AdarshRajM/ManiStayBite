package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    private String planName; // "BASIC", "PREMIUM", "ENTERPRISE"
    private Double amountPaid;
    private LocalDateTime validUntil;
    private String status; // "ACTIVE", "EXPIRED"
}
