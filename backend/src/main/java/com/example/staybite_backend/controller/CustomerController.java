package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Order;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.repository.OrderRepository;
import com.example.staybite_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/order")
    public ResponseEntity<?> placeOrder(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setPaymentStatus("SUCCESS");
        order.setOrderStatus("PREPARING");
        
        // Generate Token
        String token = "STB" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        order.setTokenNumber(token);

        orderRepository.save(order);

        return ResponseEntity.ok("Order placed successfully! Your token is: " + token);
    }
}
