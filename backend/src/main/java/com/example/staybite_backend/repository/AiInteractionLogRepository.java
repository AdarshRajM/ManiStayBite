package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.AiInteractionLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AiInteractionLogRepository extends MongoRepository<AiInteractionLog, String> {
    List<AiInteractionLog> findByUserIdOrderByTimestampDesc(Long userId);
}
