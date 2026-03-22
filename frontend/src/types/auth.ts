// Role definitions
export type Role = 'SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';

// Permission definitions
export type Permission =
  // Employee permissions
  | 'EMPLOYEE_VIEW'
  | 'EMPLOYEE_CREATE'
  | 'EMPLOYEE_EDIT'
  | 'EMPLOYEE_DELETE'
  // User management permissions
  | 'USER_VIEW'
  | 'USER_CREATE'
  | 'USER_EDIT'
  | 'USER_DELETE'
  // Role management permissions
  | 'ROLE_VIEW'
  | 'ROLE_CREATE'
  | 'ROLE_EDIT'
  | 'ROLE_DELETE'
  // Settings permissions
  | 'SETTINGS_VIEW'
  | 'SETTINGS_EDIT'
  // Dashboard permissions
  | 'DASHBOARD_VIEW'
  | 'DASHBOARD_ANALYTICS'
  // Reports permissions
  | 'REPORT_VIEW'
  | 'REPORT_EXPORT'
  // Timesheet permissions
  | 'TIMESHEET_VIEW'
  | 'TIMESHEET_CREATE'
  | 'TIMESHEET_EDIT'
  | 'TIMESHEET_SUBMIT'
  | 'TIMESHEET_APPROVE';

// Role-Permission mapping
export interface RoleDefinition {
  id: string;
  name: Role;
  displayName: string;
  description: string;
  permissions: Permission[];
  color: string;
}

// User interface
export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Login credentials
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// Register data
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

// Auth response
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Password change
export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Menu item for sidebar
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission?: Permission;
  children?: MenuItem[];
  badge?: {
    text: string;
    color: string;
  };
}
