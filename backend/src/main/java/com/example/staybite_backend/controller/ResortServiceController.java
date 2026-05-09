package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.ResortService;
import com.example.staybite_backend.repository.ResortServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ResortServiceController {

    @Autowired
    private ResortServiceRepository repository;

    @PostMapping("/book")
    public ResponseEntity<ResortService> bookSlot(@RequestBody ResortService service) {
        service.setStatus("PENDING");
        return ResponseEntity.ok(repository.save(service));
    }

    @GetMapping("/")
    public ResponseEntity<List<ResortService>> getAllBookings() {
        return ResponseEntity.ok(repository.findAll());
    }
}
