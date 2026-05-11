package com.example.staybite_backend.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class FirebaseAuthService {

    public String verifyToken(String idToken) {
        try {
            // Attempt to verify the token with Firebase Admin SDK
            // Note: This requires FirebaseApp to be initialized with google-services.json
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            return decodedToken.getUid();
        } catch (FirebaseAuthException | IllegalStateException e) {
            // IllegalStateException occurs if FirebaseApp is not initialized
            System.err.println("Firebase Auth Error (or not initialized): " + e.getMessage());
            
            // Mock fallback: if the token is a specific mock format, accept it
            if (idToken != null && idToken.startsWith("mock_firebase_token_")) {
                return idToken.substring("mock_firebase_token_".length());
            }
            
            throw new RuntimeException("Invalid Firebase Token");
        }
    }
}
