import api from './axiosConfig';

export interface Employee {
  id?: number;
  employeeId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  hireDate?: string;
  salary?: number;
  manager?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Employee Service
 * Handles employee CRUD operations
 */
class EmployeeService {
  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await api.get<ApiResponse<Employee[]>>('/employees');
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch employees' };
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
      if (response.data.success) {
        return response.data.data!;
      }
      throw new Error('Employee not found');
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch employee' };
    }
  }

  /**
   * Get employee by employee ID
   */
  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee> {
    try {
      const response = await api.get<ApiResponse<Employee>>(
        `/employees/search/by-employee-id/${employeeId}`
      );
      if (response.data.success) {
        return response.data.data!;
      }
      throw new Error('Employee not found');
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch employee' };
    }
  }

  /**
   * Get employees by department
   */
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    try {
      const response = await api.get<ApiResponse<Employee[]>>(
        `/employees/department/${department}`
      );
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching employees by department:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch employees' };
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(employee: Employee): Promise<Employee> {
    try {
      const response = await api.post<ApiResponse<Employee>>('/employees', employee);
      if (response.data.success) {
        return response.data.data!;
      }
      throw new Error('Failed to create employee');
    } catch (error: any) {
      console.error('Error creating employee:', error);
      throw error.response?.data || { success: false, message: 'Failed to create employee' };
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    try {
      const response = await api.put<ApiResponse<Employee>>(`/employees/${id}`, employee);
      if (response.data.success) {
        return response.data.data!;
      }
      throw new Error('Failed to update employee');
    } catch (error: any) {
      console.error('Error updating employee:', error);
      throw error.response?.data || { success: false, message: 'Failed to update employee' };
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/employees/${id}`);
      if (!response.data.success) {
        throw new Error('Failed to delete employee');
      }
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      throw error.response?.data || { success: false, message: 'Failed to delete employee' };
    }
  }
}

export default new EmployeeService();
