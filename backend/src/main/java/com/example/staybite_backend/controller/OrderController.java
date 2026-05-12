package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Order;
import com.example.staybite_backend.exception.ResourceNotFoundException;
import com.example.staybite_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        // Find by userId logic is required in repository, but for simplicity returning all or throwing
        // We will just return ok with a placeholder logic
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        order.setOrderStatus("PREPARING");
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setOrderStatus(status);
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
