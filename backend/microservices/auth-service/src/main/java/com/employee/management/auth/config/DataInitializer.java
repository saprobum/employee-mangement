package com.employee.management.auth.config;

import com.employee.management.auth.entity.User;
import com.employee.management.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Data initializer to populate database with default users
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Create default users if they don't exist
        createDefaultUser(
            "admin@company.com",
            "admin",
            "Super",
            "Admin",
            "admin12",
            User.Role.SUPER_ADMIN
        );

        createDefaultUser(
            "hr@company.com",
            "hrmanager",
            "HR",
            "Manager",
            "admin12",
            User.Role.HR_MANAGER
        );

        createDefaultUser(
            "employee@company.com",
            "employee",
            "John",
            "Employee",
            "admin12",
            User.Role.EMPLOYEE
        );
    }

    private void createDefaultUser(String email, String username, String firstName,
                                 String lastName, String password, User.Role role) {
        try {
            if (!userService.findByUsername(username).getUsername().isEmpty()) {
                return; // User already exists
            }
        } catch (Exception e) {
            // User doesn't exist, create it
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(password);
        user.setRole(role);
        user.setActive(true);
        user.setAvatar("https://ui-avatars.com/api/?name=" + firstName + "+" + lastName + "&background=random");

        try {
            userService.createUser(user);
            System.out.println("Created default user: " + username);
        } catch (Exception e) {
            System.out.println("Failed to create user " + username + ": " + e.getMessage());
        }
    }
}
