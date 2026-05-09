package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.ChatMessage;
import com.example.staybite_backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @MessageMapping("/send-message")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        // Save to MongoDB
        return chatMessageRepository.save(message);
    }

    @GetMapping("/api/chat/history")
    @ResponseBody
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestParam Long senderId, @RequestParam Long receiverId) {
        return ResponseEntity.ok(chatMessageRepository.findBySenderIdOrReceiverIdOrderByTimestampAsc(senderId, receiverId));
    }
}
