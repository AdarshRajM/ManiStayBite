package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByHotelId(Long hotelId);
}
