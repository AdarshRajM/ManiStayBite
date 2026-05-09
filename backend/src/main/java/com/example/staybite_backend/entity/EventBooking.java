package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;

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

    private String eventType; // "Wedding", "Birthday", "Ring Ceremony", "Corporate"
    private Integer guests;
    private LocalDate bookingDate;

    private Boolean needsCatering;
    private Boolean needsDecoration;

    private String status; // "PENDING", "APPROVED", "REJECTED"
}
