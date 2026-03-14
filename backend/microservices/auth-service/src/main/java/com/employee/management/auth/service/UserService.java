package com.employee.management.auth.service;

import com.employee.management.auth.entity.User;
import com.employee.management.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * User Service for Auth Service
 * 
 * Handles user business logic and database operations.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Find user by username
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Find user by email
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Create new user
     */
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPermissions(getPermissionsByRole(user.getRole()));
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        
        return userRepository.save(user);
    }

    /**
     * Update existing user
     */
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(userDetails.getEmail());
        user.setUsername(userDetails.getUsername());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setAvatar(userDetails.getAvatar());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.getActive());
        user.setUpdatedAt(java.time.LocalDateTime.now());

        return userRepository.save(user);
    }

    /**
     * Delete user by ID
     */
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get users by role
     */
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRoleAndActive(role);
    }

    /**
     * Get active users
     */
    public List<User> getActiveUsers() {
        return userRepository.findByActive(true);
    }

    /**
     * Get permissions based on user role
     */
    private java.util.Set<String> getPermissionsByRole(User.Role role) {
        switch (role) {
            case SUPER_ADMIN:
                return java.util.Set.of(
                    "EMPLOYEE_VIEW", "EMPLOYEE_CREATE", "EMPLOYEE_EDIT", "EMPLOYEE_DELETE",
                    "USER_VIEW", "USER_CREATE", "USER_EDIT", "USER_DELETE",
                    "ROLE_VIEW", "ROLE_CREATE", "ROLE_EDIT", "ROLE_DELETE",
                    "SETTINGS_VIEW", "SETTINGS_EDIT",
                    "DASHBOARD_VIEW", "DASHBOARD_ANALYTICS",
                    "REPORT_VIEW", "REPORT_EXPORT",
                    "TIMESHEET_VIEW", "TIMESHEET_APPROVE"
                );
            case HR_MANAGER:
                return java.util.Set.of(
                    "DASHBOARD_VIEW", "DASHBOARD_ANALYTICS",
                    "EMPLOYEE_VIEW", "EMPLOYEE_CREATE", "EMPLOYEE_EDIT", "EMPLOYEE_DELETE",
                    "REPORT_VIEW", "REPORT_EXPORT",
                    "TIMESHEET_VIEW", "TIMESHEET_APPROVE"
                );
            case EMPLOYEE:
                return java.util.Set.of(
                    "DASHBOARD_VIEW",
                    "EMPLOYEE_VIEW",
                    "TIMESHEET_VIEW", "TIMESHEET_CREATE", "TIMESHEET_EDIT", "TIMESHEET_SUBMIT"
                );
            default:
                return java.util.Set.of();
        }
    }
}