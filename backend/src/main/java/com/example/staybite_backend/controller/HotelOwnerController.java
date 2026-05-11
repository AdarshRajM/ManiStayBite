package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Food;
import com.example.staybite_backend.entity.Room;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.entity.Role;
import com.example.staybite_backend.repository.FoodRepository;
import com.example.staybite_backend.repository.RoomRepository;
import com.example.staybite_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
public class HotelOwnerController {

    @Autowired
    private FoodRepository foodRepository;
    
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public ResponseEntity<String> getOwnerDashboard() {
        return ResponseEntity.ok("Welcome to the Hotel Owner Dashboard! Only HOTEL_OWNER can see this.");
    }

    // --- FOOD MANAGEMENT ---
    @GetMapping("/food")
    public ResponseEntity<List<Food>> getAllFood() {
        return ResponseEntity.ok(foodRepository.findAll());
    }

    @PostMapping("/food")
    public ResponseEntity<Food> addFood(@RequestBody Food food) {
        if (food.getCategory() == null || food.getCategory().trim().isEmpty()) {
            food.setCategory("Uncategorized");
        }
        return ResponseEntity.ok(foodRepository.save(food));
    }

    @DeleteMapping("/food/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id) {
        foodRepository.deleteById(id);
        return ResponseEntity.ok("Food deleted successfully.");
    }

    @PutMapping("/food/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food foodDetails) {
        Food food = foodRepository.findById(id).orElseThrow();
        food.setFoodName(foodDetails.getFoodName());
        food.setPrice(foodDetails.getPrice());
        food.setCategory(foodDetails.getCategory());
        food.setDescription(foodDetails.getDescription());
        food.setImageUrl(foodDetails.getImageUrl());
        food.setVegetarian(foodDetails.getVegetarian());
        food.setSpicy(foodDetails.getSpicy());
        food.setRating(foodDetails.getRating());
        food.setTags(foodDetails.getTags());
        food.setOfferTag(foodDetails.getOfferTag());
        food.setCombo(foodDetails.getCombo());
        food.setSubscriptionPlan(foodDetails.getSubscriptionPlan());
        return ResponseEntity.ok(foodRepository.save(food));
    }

    // --- ROOM MANAGEMENT ---
    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @PostMapping("/rooms")
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomRepository.save(room));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
        return ResponseEntity.ok("Room deleted successfully.");
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room room = roomRepository.findById(id).orElseThrow();
        room.setPrice(roomDetails.getPrice());
        room.setStatus(roomDetails.getStatus());
        return ResponseEntity.ok(roomRepository.save(room));
    }

    // --- EMPLOYEE MANAGEMENT ---
    @GetMapping("/employees")
    public ResponseEntity<List<User>> getAllEmployees() {
        return ResponseEntity.ok(userRepository.findByRole(Role.EMPLOYEE));
    }

    @PostMapping("/employees")
    public ResponseEntity<User> addEmployee(@RequestBody User employee) {
        employee.setRole(Role.EMPLOYEE);
        if (employee.getPassword() == null || employee.getPassword().trim().isEmpty()) {
            employee.setPassword(passwordEncoder.encode("welcome123"));
        } else {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }
        return ResponseEntity.ok(userRepository.save(employee));
    }

    @PutMapping("/employees/{id}/permissions")
    public ResponseEntity<User> updateEmployeePermissions(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User employee = userRepository.findById(id).orElseThrow();
        String permissions = payload.getOrDefault("permissions", employee.getPermissions());
        String assignedTasks = payload.getOrDefault("assignedTasks", employee.getAssignedTasks());
        employee.setPermissions(permissions);
        employee.setAssignedTasks(assignedTasks);
        return ResponseEntity.ok(userRepository.save(employee));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("Employee deleted successfully.");
    }
}
