-- ============================================
-- Database Setup Script for Employee Management System
-- Run this in phpMyAdmin (http://localhost/phpmyadmin/)
-- ============================================

-- Create Auth Service Database
CREATE DATABASE IF NOT EXISTS auth_service_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create User Service Database
CREATE DATABASE IF NOT EXISTS user_service_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create Employee Service Database
CREATE DATABASE IF NOT EXISTS employee_service_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Show all databases
SHOW DATABASES;

-- ============================================
-- Grant privileges (if needed)
-- ============================================
-- GRANT ALL PRIVILEGES ON auth_service_db.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON user_service_db.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON employee_service_db.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;
