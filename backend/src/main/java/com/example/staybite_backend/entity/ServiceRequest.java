package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String serviceType; // "POOL", "SPA", "CAB", "ROOM_SERVICE", "TABLE"
    private String details; // JSON or string details about the request
    
    private LocalDateTime scheduledTime;

    private String status; // "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"
    private Double cost;

    private LocalDateTime createdAt = LocalDateTime.now();
}
