package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "resort_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResortService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName; // "SPA", "SWIMMING_POOL", "GYM", "RESTAURANT"
    private String slotTime;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private String status; // "PENDING", "APPROVED"
}
