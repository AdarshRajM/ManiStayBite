package com.example.staybite_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@Service
public class S3Service {

    // Placeholder for actual AWS SDK implementation
    // AWS_ACCESS_KEY and AWS_SECRET_KEY would be loaded from env vars

    public String uploadFile(MultipartFile file) {
        // Mock upload
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        return "https://staybite-bucket.s3.amazonaws.com/" + fileName;
    }
}
