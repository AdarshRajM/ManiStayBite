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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
public class HotelOwnerController {

    @Autowired
    private FoodRepository foodRepository;
    
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

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
        return ResponseEntity.ok(userRepository.save(employee));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("Employee deleted successfully.");
    }
}
