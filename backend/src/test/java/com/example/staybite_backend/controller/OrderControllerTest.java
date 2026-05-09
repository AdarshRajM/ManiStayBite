package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Order;
import com.example.staybite_backend.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OrderControllerTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderController orderController;

    @Test
    public void testUpdateOrderStatus() {
        // Arrange
        Long orderId = 1L;
        String newStatus = "DELIVERED";
        
        Order mockOrder = new Order();
        mockOrder.setOrderId(orderId);
        mockOrder.setOrderStatus("PREPARING");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        // Act
        ResponseEntity<Order> response = orderController.updateOrderStatus(orderId, newStatus);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals("DELIVERED", response.getBody().getOrderStatus());
    }
}
