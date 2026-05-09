package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}
