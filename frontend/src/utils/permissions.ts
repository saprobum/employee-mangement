import type { Role, RoleDefinition, Permission, MenuItem } from '../types/auth';

// All available permissions
export const ALL_PERMISSIONS: Permission[] = [
  // Employee
  'EMPLOYEE_VIEW',
  'EMPLOYEE_CREATE',
  'EMPLOYEE_EDIT',
  'EMPLOYEE_DELETE',
  // User
  'USER_VIEW',
  'USER_CREATE',
  'USER_EDIT',
  'USER_DELETE',
  // Role
  'ROLE_VIEW',
  'ROLE_CREATE',
  'ROLE_EDIT',
  'ROLE_DELETE',
  // Settings
  'SETTINGS_VIEW',
  'SETTINGS_EDIT',
  // Dashboard
  'DASHBOARD_VIEW',
  'DASHBOARD_ANALYTICS',
  // Reports
  'REPORT_VIEW',
  'REPORT_EXPORT',
  // Timesheet
  'TIMESHEET_VIEW',
  'TIMESHEET_CREATE',
  'TIMESHEET_EDIT',
  'TIMESHEET_SUBMIT',
  'TIMESHEET_APPROVE',
];

// Role definitions with permissions
export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  SUPER_ADMIN: {
    id: '1',
    name: 'SUPER_ADMIN',
    displayName: 'Super Admin',
    description: 'Full access to all modules and settings',
    permissions: [
      'EMPLOYEE_VIEW', 'EMPLOYEE_CREATE', 'EMPLOYEE_EDIT', 'EMPLOYEE_DELETE',
      'USER_VIEW', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE',
      'ROLE_VIEW', 'ROLE_CREATE', 'ROLE_EDIT', 'ROLE_DELETE',
      'SETTINGS_VIEW', 'SETTINGS_EDIT',
      'DASHBOARD_VIEW', 'DASHBOARD_ANALYTICS',
      'REPORT_VIEW', 'REPORT_EXPORT',
      'TIMESHEET_VIEW', 'TIMESHEET_APPROVE',
    ],
    color: '#ef4444',
  },
  HR_MANAGER: {
    id: '2',
    name: 'HR_MANAGER',
    displayName: 'HR Manager',
    description: 'Manage employees, view reports, no system settings',
    permissions: [
      'DASHBOARD_VIEW',
      'DASHBOARD_ANALYTICS',
      'EMPLOYEE_VIEW',
      'EMPLOYEE_CREATE',
      'EMPLOYEE_EDIT',
      'EMPLOYEE_DELETE',
      'REPORT_VIEW',
      'REPORT_EXPORT',
      'TIMESHEET_VIEW',
      'TIMESHEET_APPROVE',
    ],
    color: '#3b82f6',
  },
  EMPLOYEE: {
    id: '3',
    name: 'EMPLOYEE',
    displayName: 'Employee',
    description: 'View-only access to own profile and limited dashboard',
    permissions: [
      'DASHBOARD_VIEW',
      'EMPLOYEE_VIEW',
      'TIMESHEET_VIEW',
      'TIMESHEET_CREATE',
      'TIMESHEET_EDIT',
      'TIMESHEET_SUBMIT',
    ],
    color: '#22c55e',
  },
};

// Menu configuration with permissions
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    permission: 'DASHBOARD_VIEW',
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: 'people',
    path: '/employees',
    permission: 'EMPLOYEE_VIEW',
    children: [
      {
        id: 'employees-list',
        label: 'All Employees',
        icon: 'list',
        path: '/employees',
        permission: 'EMPLOYEE_VIEW',
      },
      {
        id: 'employees-add',
        label: 'Add Employee',
        icon: 'person_add',
        path: '/employees/add',
        permission: 'EMPLOYEE_CREATE',
      },
    ],
  },
  {
    id: 'timesheets',
    label: 'Timesheets',
    icon: 'assignment',
    path: '/timesheets',
    permission: 'TIMESHEET_VIEW',
    children: [
      {
        id: 'timesheets-list',
        label: 'My Timesheets',
        icon: 'list',
        path: '/timesheets',
        permission: 'TIMESHEET_VIEW',
      },
      {
        id: 'timesheets-add',
        label: 'Submit Timesheet',
        icon: 'add_circle',
        path: '/timesheets/add',
        permission: 'TIMESHEET_CREATE',
      },
    ],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: 'admin_panel_settings',
    path: '/users',
    permission: 'USER_VIEW',
    badge: { text: 'Admin', color: 'red' },
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        icon: 'list',
        path: '/users',
        permission: 'USER_VIEW',
      },
      {
        id: 'users-add',
        label: 'Add User',
        icon: 'person_add',
        path: '/users/add',
        permission: 'USER_CREATE',
      },
    ],
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: 'security',
    path: '/roles',
    permission: 'ROLE_VIEW',
    badge: { text: 'Admin', color: 'red' },
    children: [
      {
        id: 'roles-list',
        label: 'All Roles',
        icon: 'list',
        path: '/roles',
        permission: 'ROLE_VIEW',
      },
      {
        id: 'roles-add',
        label: 'Add Role',
        icon: 'add_card',
        path: '/roles/add',
        permission: 'ROLE_CREATE',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'assessment',
    path: '/reports',
    permission: 'REPORT_VIEW',
    children: [
      {
        id: 'reports-employee',
        label: 'Employee Report',
        icon: 'description',
        path: '/reports/employee',
        permission: 'REPORT_VIEW',
      },
      {
        id: 'reports-department',
        label: 'Department Report',
        icon: 'description',
        path: '/reports/department',
        permission: 'REPORT_VIEW',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    permission: 'SETTINGS_VIEW',
    badge: { text: 'Admin', color: 'red' },
  },
];

// Helper function to get role by name
export const getRoleDefinition = (role: Role): RoleDefinition => {
  return ROLE_DEFINITIONS[role];
};

// Helper function to check if user has permission
export const hasPermission = (userPermissions: Permission[], permission: Permission): boolean => {
  return userPermissions.includes(permission);
};

// Helper function to check if user has any of the permissions
export const hasAnyPermission = (userPermissions: Permission[], permissions: Permission[]): boolean => {
  return permissions.some(permission => userPermissions.includes(permission));
};

// Helper function to check if user has all permissions
export const hasAllPermissions = (userPermissions: Permission[], permissions: Permission[]): boolean => {
  return permissions.every(permission => userPermissions.includes(permission));
};

// Helper function to filter menu items by permissions
export const filterMenuByPermissions = (items: MenuItem[], userPermissions: Permission[]): MenuItem[] => {
  return items
    .filter(item => !item.permission || hasPermission(userPermissions, item.permission))
    .map(item => ({
      ...item,
      children: item.children ? filterMenuByPermissions(item.children, userPermissions) : undefined,
    }))
    .filter(item => !item.children || item.children.length > 0);
};

// Helper function to get role color
export const getRoleColor = (role: Role): string => {
  return ROLE_DEFINITIONS[role].color;
};

// Helper function to get role display name
export const getRoleDisplayName = (role: Role): string => {
  return ROLE_DEFINITIONS[role].displayName;
};
