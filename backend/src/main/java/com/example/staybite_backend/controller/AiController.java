package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.AiInteractionLog;
import com.example.staybite_backend.repository.AiInteractionLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiInteractionLogRepository aiLogRepository;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithAi(@RequestBody Map<String, String> request) {
        String userQuery = request.get("query");
        
        // Mock AI processing
        String aiResponse = "This is an AI generated response for: " + userQuery;

        // Log to MongoDB
        Long mockUserId = 1L; // Get from JWT in real scenario
        AiInteractionLog log = new AiInteractionLog(null, mockUserId, userQuery, aiResponse, LocalDateTime.now());
        aiLogRepository.save(log);

        Map<String, String> response = new HashMap<>();
        response.put("response", aiResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<Map<String, Object>> getRecommendations(@RequestParam Long userId) {
        Map<String, Object> recs = new HashMap<>();
        recs.put("recommendedFoods", new String[]{"Pizza", "Cold Coffee"});
        recs.put("recommendedServices", new String[]{"Spa"});
        
        AiInteractionLog log = new AiInteractionLog(null, userId, "Get Recommendations", recs.toString(), LocalDateTime.now());
        aiLogRepository.save(log);
        
        return ResponseEntity.ok(recs);
    }
}
