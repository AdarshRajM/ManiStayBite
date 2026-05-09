package com.example.staybite_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final ConcurrentHashMap<String, Long> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> timeWindows = new ConcurrentHashMap<>();
    
    private static final long MAX_REQUESTS = 50; // 50 requests
    private static final long TIME_WINDOW_MS = 60000; // per minute

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String clientIp = request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();

        timeWindows.putIfAbsent(clientIp, currentTime);
        requestCounts.putIfAbsent(clientIp, 0L);

        // Reset window if time elapsed
        if (currentTime - timeWindows.get(clientIp) > TIME_WINDOW_MS) {
            timeWindows.put(clientIp, currentTime);
            requestCounts.put(clientIp, 0L);
        }

        long currentCount = requestCounts.get(clientIp);
        if (currentCount >= MAX_REQUESTS) {
            response.setStatus(429); // Too Many Requests
            response.getWriter().write("Rate limit exceeded. Try again later.");
            return;
        }

        requestCounts.put(clientIp, currentCount + 1);
        filterChain.doFilter(request, response);
    }
}
