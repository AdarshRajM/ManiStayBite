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
        request.put("query", "Recommend a room");

        // Act
        ResponseEntity<Map<String, String>> response = aiController.chatWithAi(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().containsKey("response"));
        assertTrue(response.getBody().get("response").contains("This is an AI generated response"));
    }
}
