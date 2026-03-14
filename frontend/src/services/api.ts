import axios from 'axios';
import type { Employee } from '../types/employee';

// API base URL - replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const employeeApi = {
  getEmployees: async (params?: {
    search?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  getEmployee: async (id: number) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData: any) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id: number, employeeData: any) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id: number) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },
};

// Generate mock employees
const generateEmployees = (count: number): Employee[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const positions = ['Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Director'];
  const skillsList = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'UI/UX', 'Project Management', 'Data Analysis'];
  const projects = ['Website Redesign', 'Mobile App', 'API Integration', 'Cloud Migration', 'Security Audit'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = `Employee${i + 1}`;
    const lastName = `Last${i + 1}`;
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];

    return {
      id: i + 1,
      firstName,
      lastName,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      jobTitle: `${position}`,
      department,
      hireDate: new Date(2020 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      status: ['Active', 'Inactive', 'On Leave'][Math.floor(Math.random() * 3)] as 'Active' | 'Inactive' | 'On Leave',
      address: {
        street: `${Math.floor(Math.random() * 1000) + 1} Main St`,
        city: `City${i + 1}`,
        state: `State${String.fromCharCode(65 + (i % 26))}`,
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'USA'
      },
      contact: {
        phone: `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        emergencyContact: {
          name: `Emergency Contact ${i + 1}`,
          relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)],
          phone: `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
        }
      },
      employment: {
        department,
        position,
        startDate: new Date(2020 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        status: ['Active', 'Inactive', 'On Leave'][Math.floor(Math.random() * 3)] as 'Active' | 'Inactive' | 'On Leave',
        salary: Math.floor(Math.random() * 100000) + 50000,
        manager: `Manager${Math.floor(Math.random() * 5) + 1}`
      },
      skills: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, j) => ({
        name: skillsList[j % skillsList.length],
        level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][Math.floor(Math.random() * 4)] as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
        yearsExperience: Math.floor(Math.random() * 10) + 1
      })),
      projects: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        id: j + 1,
        name: projects[j % projects.length],
        role: positions[j % positions.length],
        startDate: new Date(2021 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        endDate: j % 2 === 0 ? new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString() : undefined,
        status: ['Completed', 'In Progress', 'Planned'][j % 3] as 'Completed' | 'In Progress' | 'Planned'
      })),
      certifications: Array.from({ length: Math.floor(Math.random() * 3) }, (_, j) => ({
        id: j + 1,
        name: `Certification ${j + 1}`,
        issuer: `Issuer ${String.fromCharCode(65 + j)}`,
        dateIssued: new Date(2020 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        expiryDate: new Date(2025 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
      })),
      performanceReviews: Array.from({ length: Math.floor(Math.random() * 4) }, (_, j) => ({
        id: j + 1,
        date: new Date(2021 + j, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        reviewer: `Reviewer ${Math.floor(Math.random() * 5) + 1}`,
        rating: Math.floor(Math.random() * 5) + 1,
        comments: `Performance review comment ${j + 1}`
      }))
    };
  });
};

// Cache mock employees to maintain consistency across calls
let cachedEmployees: Employee[] | null = null;

const getMockEmployees = (): Employee[] => {
  if (!cachedEmployees) {
    cachedEmployees = generateEmployees(50);
  }
  return cachedEmployees;
};

// Mock API endpoints for development
export const mockApi = {
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  getEmployees: async (params?: {
    search?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    await mockApi.delay(500);

    const employees = getMockEmployees();
    let filteredEmployees = [...employees];

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.jobTitle.toLowerCase().includes(searchLower)
      );
    }

    if (params?.department && params.department !== 'All') {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.department === params.department
      );
    }

    if (params?.status && params.status !== 'All') {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.status === params.status
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    return {
      employees: paginatedEmployees,
      total: filteredEmployees.length,
      page,
      totalPages: Math.ceil(filteredEmployees.length / limit),
      hasNext: endIndex < filteredEmployees.length,
      hasPrev: page > 1,
    };
  },

  getEmployee: async (id: number) => {
    await mockApi.delay(800);

    const employees = getMockEmployees();
    const employee = employees.find(emp => emp.id === id);

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  },
};

export const useMockApi = () => {
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
};

export default api;