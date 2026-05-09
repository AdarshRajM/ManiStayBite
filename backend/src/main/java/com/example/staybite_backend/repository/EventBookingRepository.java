package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.EventBooking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventBookingRepository extends JpaRepository<EventBooking, Long> {
}
