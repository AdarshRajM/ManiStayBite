package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    private String roomType;
    private Double price;
    private String status; // "AVAILABLE", "BOOKED", "MAINTENANCE"

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}
