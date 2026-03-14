package com.employee.management.gateway;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Fallback Controller for API Gateway
 * 
 * Provides fallback responses when services are unavailable.
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/auth")
    public ResponseEntity<Map<String, Object>> authFallback() {
        return createFallbackResponse("Auth Service", "Authentication service is currently unavailable. Please try again later.");
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> userFallback() {
        return createFallbackResponse("User Service", "User management service is currently unavailable. Please try again later.");
    }

    @GetMapping("/employee")
    public ResponseEntity<Map<String, Object>> employeeFallback() {
        return createFallbackResponse("Employee Service", "Employee management service is currently unavailable. Please try again later.");
    }

    private ResponseEntity<Map<String, Object>> createFallbackResponse(String service, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("service", service);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
