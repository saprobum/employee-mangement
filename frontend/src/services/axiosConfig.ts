import axios from 'axios';
import { API_BASE_URL } from '../config/network';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');

    // Add token to authorization header if it exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn('Authentication failed. Clearing session...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

// Export the configured axios instance
export default api;

// Auth API functions
export const authApi = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  refreshToken: () => 
    api.post('/auth/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
};

// User API functions
export const userApi = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id: number) => api.get(`/users/${id}`),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: number, userData: any) => api.put(`/users/${id}`, userData),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

// Employee API functions
export const employeeApi = {
  getAllEmployees: () => api.get('/employees'),
  getEmployeeById: (id: number) => api.get(`/employees/${id}`),
  getEmployeeByEmployeeId: (employeeId: string) => 
    api.get(`/employees/search/by-employee-id/${employeeId}`),
  getEmployeesByDepartment: (department: string) => 
    api.get(`/employees/department/${department}`),
  createEmployee: (employeeData: any) => api.post('/employees', employeeData),
  updateEmployee: (id: number, employeeData: any) => api.put(`/employees/${id}`, employeeData),
  deleteEmployee: (id: number) => api.delete(`/employees/${id}`),
};

// Utility functions
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
