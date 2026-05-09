package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
}
