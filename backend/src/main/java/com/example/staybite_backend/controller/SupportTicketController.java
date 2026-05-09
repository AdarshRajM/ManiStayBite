package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.SupportTicket;
import com.example.staybite_backend.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class SupportTicketController {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SupportTicket>> getUserTickets(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketRepository.findByUserId(userId));
    }

    @PostMapping("/raise")
    public ResponseEntity<SupportTicket> raiseTicket(@RequestBody SupportTicket ticket) {
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setStatus("OPEN");
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{ticketId}/resolve")
    public ResponseEntity<SupportTicket> resolveTicket(@PathVariable Long ticketId, @RequestParam String response) {
        SupportTicket ticket = ticketRepository.findById(ticketId).orElseThrow();
        ticket.setStatus("RESOLVED");
        ticket.setAdminResponse(response);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }
}
