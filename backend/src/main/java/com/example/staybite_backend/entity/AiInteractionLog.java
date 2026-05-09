package com.example.staybite_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "ai_interaction_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiInteractionLog {
    @Id
    private String id;
    private Long userId;
    private String query;
    private String response;
    private LocalDateTime timestamp;
}
