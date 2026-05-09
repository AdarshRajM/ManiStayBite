package com.example.staybite_backend.repository;

import com.example.staybite_backend.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findBySenderIdOrReceiverIdOrderByTimestampAsc(Long senderId, Long receiverId);
}
