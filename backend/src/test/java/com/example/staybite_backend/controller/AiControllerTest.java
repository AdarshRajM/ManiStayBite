package com.example.staybite_backend.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
public class AiControllerTest {

    @InjectMocks
    private AiController aiController;

    @Test
    public void testChatWithBot() {
        // Arrange
        Map<String, String> request = new HashMap<>();
        request.put("message", "Recommend a room");

        // Act
        ResponseEntity<Map<String, String>> response = aiController.chatWithBot(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().containsKey("reply"));
        assertTrue(response.getBody().get("reply").contains("Infinity Pool"));
    }
}
