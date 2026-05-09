package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Order;
import com.example.staybite_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getEmployeeDashboard() {
        return ResponseEntity.ok("Welcome to the Employee Dashboard! Only EMPLOYEE can see this.");
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getActiveOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setOrderStatus(status);
        orderRepository.save(order);
        return ResponseEntity.ok("Order status updated to " + status);
    }
}
