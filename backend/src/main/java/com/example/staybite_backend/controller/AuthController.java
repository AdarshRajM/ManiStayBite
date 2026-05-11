package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Role;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.repository.UserRepository;
import com.example.staybite_backend.security.JwtUtil;
import com.example.staybite_backend.exception.ResourceNotFoundException;
import com.example.staybite_backend.service.FirebaseAuthService;
import com.example.staybite_backend.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");

        if (email == null || email.isBlank()) {
            return badRequestResponse("Email is required for signup.");
        }
        if (password == null || password.isBlank()) {
            return badRequestResponse("Password is required for signup.");
        }
        if (name == null || name.isBlank()) {
            return badRequestResponse("Name is required for signup.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return badRequestResponse("Email is already in use.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        
        // Signup always creates a regular customer account.
        user.setRole(Role.CUSTOMER);
        
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank()) {
            return badRequestResponse("Email is required for login.");
        }
        if (password == null || password.isBlank()) {
            return badRequestResponse("Password is required for login.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", userDetails.getUsername());
        
        // Return role as well
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userDetails.getUsername()));
        response.put("role", user.getRole().name());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<?> firebaseLogin(@RequestBody Map<String, String> request) {
        String firebaseToken = request.get("token");
        String name = request.getOrDefault("name", "User");
        String phoneOrEmail = request.get("identifier"); // Phone number or Email from Firebase

        if (firebaseToken == null || firebaseToken.isBlank()) {
            return badRequestResponse("Firebase token is required for firebase login.");
        }
        if (phoneOrEmail == null || phoneOrEmail.isBlank()) {
            return badRequestResponse("Identifier is required for firebase login.");
        }

        try {
            String uid = firebaseAuthService.verifyToken(firebaseToken);
            
            // Check if user exists by phone/email or UID
            User user = userRepository.findByEmail(phoneOrEmail).orElseGet(() -> {
                User newUser = new User();
                newUser.setName(name);
                newUser.setEmail(phoneOrEmail);
                newUser.setPassword(passwordEncoder.encode(uid)); // Dummy password for oauth
                newUser.setRole(Role.CUSTOMER);
                return userRepository.save(newUser);
            });

            // Generate JWT
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRole().name())
                    .build();

            String jwt = jwtUtil.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier"); // Email or Phone for WhatsApp
        if (identifier == null || identifier.isBlank()) {
            return badRequestResponse("Identifier is required to send OTP.");
        }
        
        String otp = otpService.generateOtp(identifier);
        
        // Mock sending OTP
        System.out.println("OTP for " + identifier + ": " + otp);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully. Valid for 5 minutes.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String otp = request.get("otp");
        String name = request.getOrDefault("name", "User");

        if (identifier == null || identifier.isBlank()) {
            return badRequestResponse("Identifier is required to verify OTP.");
        }
        if (otp == null || otp.isBlank()) {
            return badRequestResponse("OTP code is required.");
        }

        boolean isValid = otpService.verifyOtp(identifier, otp);
        if (!isValid) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid or expired OTP, or too many attempts."));
        }

        // Login or Create user
        User user = userRepository.findByEmail(identifier).orElseGet(() -> {
            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(identifier);
            newUser.setPassword(passwordEncoder.encode("custom_otp_auth")); 
            newUser.setRole(Role.CUSTOMER);
            return userRepository.save(newUser);
        });

        // Generate JWT
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());

        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, String>> badRequestResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Bad Request");
        error.put("message", message);
        return ResponseEntity.badRequest().body(error);
    }
}
