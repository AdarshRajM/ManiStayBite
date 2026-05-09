package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    private String id;

    private String action; // e.g., "USER_LOGIN", "ROOM_EDITED"
    private String performedBy; // Username or Email
    private String entityAffected; // e.g., "Room 101"
    private LocalDateTime timestamp;
    private String ipAddress;
}
