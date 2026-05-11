package com.example.staybite_backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Store OTP details
    private final Map<String, OtpDetails> otpCache = new ConcurrentHashMap<>();

    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // 5 minutes
    private static final int MAX_ATTEMPTS = 3;

    public String generateOtp(String key) {
        String otp = String.format("%04d", new Random().nextInt(10000));
        otpCache.put(key, new OtpDetails(otp, System.currentTimeMillis() + OTP_VALID_DURATION));
        return otp;
    }

    public boolean verifyOtp(String key, String enteredOtp) {
        if (!otpCache.containsKey(key)) {
            return false;
        }

        OtpDetails details = otpCache.get(key);

        if (System.currentTimeMillis() > details.getExpiryTime()) {
            otpCache.remove(key); // Expired
            return false;
        }

        if (details.getAttempts() >= MAX_ATTEMPTS) {
            otpCache.remove(key); // Too many attempts
            return false;
        }

        if (details.getOtp().equals(enteredOtp)) {
            otpCache.remove(key); // Success
            return true;
        } else {
            details.incrementAttempts();
            return false;
        }
    }

    public void clearOtp(String key) {
        otpCache.remove(key);
    }

    private static class OtpDetails {
        private final String otp;
        private final long expiryTime;
        private int attempts;

        public OtpDetails(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
            this.attempts = 0;
        }

        public String getOtp() {
            return otp;
        }

        public long getExpiryTime() {
            return expiryTime;
        }

        public int getAttempts() {
            return attempts;
        }

        public void incrementAttempts() {
            this.attempts++;
        }
    }
}
