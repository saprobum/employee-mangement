package com.employee.management.auth.controller;

import com.employee.management.auth.dto.UserDto;
import com.employee.management.auth.entity.User;
import com.employee.management.auth.service.UserService;
import com.employee.management.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller for Auth Service
 * 
 * Handles user authentication, registration, and token management.
 */
@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * User login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtTokenProvider.generateToken(authentication);
            User user = userService.findByUsername(loginRequest.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", jwt);
            response.put("user", UserDto.fromEntity(user));

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * User registration endpoint
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User();
            user.setEmail(registerRequest.getEmail());
            user.setUsername(registerRequest.getUsername());
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setPassword(registerRequest.getPassword());
            user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : User.Role.EMPLOYEE);
            user.setActive(true);
            user.setAvatar("https://ui-avatars.com/api/?name=" + 
                registerRequest.getFirstName() + "+" + registerRequest.getLastName() + "&background=random");

            User createdUser = userService.createUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", UserDto.fromEntity(createdUser));
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Token refresh endpoint
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            if (jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromJWT(jwt);
                User user = userService.findByUsername(username);
                
                // Create authentication with user details
                org.springframework.security.core.userdetails.User userDetails = 
                    new org.springframework.security.core.userdetails.User(
                        username, user.getPassword(), user.getPermissions().stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(java.util.stream.Collectors.toList())
                    );
                
                String newToken = jwtTokenProvider.generateToken(
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
                );
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", newToken);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Invalid token");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // DTO classes for requests
    public static class LoginRequest {
        private String username;
        private String password;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String email;
        private String username;
        private String firstName;
        private String lastName;
        private String password;
        private User.Role role;

        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }
}