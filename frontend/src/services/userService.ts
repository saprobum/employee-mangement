import api from './axiosConfig';

export interface User {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';
  active?: boolean;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * User Service
 * Handles user management operations
 */
class UserService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>('/users');
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch users' };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/${id}`);
      if (response.data.success) {
        return response.data.data!;
      }
      throw new Error('User not found');
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch user' };
    }
  }

  /**
   * Create new user
   */
  async createUser(user: User & { password: string }): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>('/users', user);
      if (response.data.success) {
        return response.data.data!;
      }
      throw new Error('Failed to create user');
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error.response?.data || { success: false, message: 'Failed to create user' };
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, user);
      if (response.data.success) {
        return response.data.data!;
      }
      throw new Error('Failed to update user');
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error.response?.data || { success: false, message: 'Failed to update user' };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
      if (!response.data.success) {
        throw new Error('Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error.response?.data || { success: false, message: 'Failed to delete user' };
    }
  }
}

export default new UserService();
