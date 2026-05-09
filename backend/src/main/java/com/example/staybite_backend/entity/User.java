package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private Role role;
    private String mobile;
    private String aadhaar;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel; // Nullable for CUSTOMER and SUPER_ADMIN
}
