// Network Configuration & API Endpoints
// Centralized network settings for the Employee Management System

// Base API URL from environment variable - SINGLE ENTRY POINT
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API Endpoints - All go through the Gateway
const API_ENDPOINTS = {
  // Authentication Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // User Management Endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  
  // Employee Management Endpoints
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id: number) => `/employees/${id}`,
    BY_EMPLOYEE_ID: (employeeId: string) => `/employees/search/by-employee-id/${employeeId}`,
    BY_DEPARTMENT: (department: string) => `/employees/department/${department}`,
  },
};

// Network Configuration Class
class NetworkConfig {
  static readonly API_BASE_URL = API_BASE_URL;
  
  // Get full URL for an endpoint
  static getFullUrl(endpoint: string): string {
    return `${API_BASE_URL}${endpoint}`;
  }
}

export { API_BASE_URL, API_ENDPOINTS, NetworkConfig };
