package com.example.staybite_backend.aspect;

import com.example.staybite_backend.entity.AuditLog;
import com.example.staybite_backend.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Aspect
@Component
public class AuditLogAspect {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @AfterReturning(pointcut = "execution(* com.example.staybite_backend.controller.*.*(..))", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        
        // Skip get methods to reduce spam
        if (methodName.startsWith("get")) return;

        String username = "Anonymous";
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String ipAddress = request.getRemoteAddr();

        AuditLog log = new AuditLog();
        log.setAction(methodName);
        log.setPerformedBy(username);
        log.setEntityAffected(joinPoint.getTarget().getClass().getSimpleName());
        log.setTimestamp(LocalDateTime.now());
        log.setIpAddress(ipAddress);

        auditLogRepository.save(log);
    }
}
