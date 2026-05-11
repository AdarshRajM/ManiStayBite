package com.example.staybite_backend.controller;

import com.example.staybite_backend.entity.Role;
import com.example.staybite_backend.entity.User;
import com.example.staybite_backend.repository.UserRepository;
import com.example.staybite_backend.security.JwtUtil;
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
        if (userRepository.findByEmail(request.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(request.get("name"));
        user.setEmail(request.get("email"));
        user.setPassword(passwordEncoder.encode(request.get("password")));
        
        // Default role is CUSTOMER, but allowing role passing for testing
        String roleStr = request.getOrDefault("role", "CUSTOMER");
        user.setRole(Role.valueOf(roleStr));
        
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.get("email"), request.get("password")));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", userDetails.getUsername());
        
        // Return role as well
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        response.put("role", user.getRole().name());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<?> firebaseLogin(@RequestBody Map<String, String> request) {
        String firebaseToken = request.get("token");
        String name = request.getOrDefault("name", "User");
        String phoneOrEmail = request.get("identifier"); // Phone number or Email from Firebase

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
        // String channel = request.get("channel"); // EMAIL or WHATSAPP
        
        String otp = otpService.generateOtp(identifier);
        
        // Mock sending OTP
        System.out.println("OTP for " + identifier + ": " + otp);
        
        return ResponseEntity.ok("OTP sent successfully. Valid for 5 minutes.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String otp = request.get("otp");
        String name = request.getOrDefault("name", "User");

        boolean isValid = otpService.verifyOtp(identifier, otp);
        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid or expired OTP, or too many attempts.");
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
}
