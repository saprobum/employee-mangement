package com.employee.management.auth.repository;

import com.employee.management.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User Repository for Auth Service
 * 
 * Provides database access methods for User entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);

    /**
     * Check if user exists by username
     */
    boolean existsByUsername(String username);

    /**
     * Find active users by role
     */
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.active = true")
    List<User> findByRoleAndActive(@Param("role") User.Role role);

    /**
     * Find all active users
     */
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findByActive(boolean active);

    /**
     * Find users by role
     */
    List<User> findByRole(User.Role role);
}