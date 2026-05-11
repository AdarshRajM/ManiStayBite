package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String tokenNumber;
    private String paymentStatus; // "SUCCESS", "PENDING"
    private String orderStatus; // "PREPARING", "COOKING", "PACKED", "DELIVERED"
    
    @Column(columnDefinition = "TEXT")
    private String itemsDetails; // JSON representing cart items, addons, combos
    
    private Double totalAmount;
    private String orderType; // "ROOM_SERVICE", "BUFFET", "TABLE_RESERVATION"
    private String specialInstructions; // "Extra cheese, no onion"

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User employee;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}
