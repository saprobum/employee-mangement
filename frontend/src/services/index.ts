// Export all API services
export { default as authService } from './auth';
export { default as employeeService } from './employeeService';
export { default as userService } from './userService';

// Export types
export type { LoginRequest, LoginResponse, ApiResponse } from './auth';
export type { Employee } from './employeeService';
export type { User } from './userService';

// Export axios instance and utilities
export { default as api, setAuthToken, getCurrentUser, isAuthenticated, logout } from './axiosConfig';
