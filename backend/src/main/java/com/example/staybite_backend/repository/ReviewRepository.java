package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
