import { create } from 'zustand';
import { useAuthStore } from './authStore';
import type { Permission } from '../types/auth';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';

interface PermissionState {
  // Actions
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  hasRole: (role: string) => boolean;
}

export const usePermissionStore = create<PermissionState>()(() => ({
  // Check if user has a specific permission
  can: (permission: Permission): boolean => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    return hasPermission(user.permissions, permission);
  },

  // Check if user has any of the permissions
  canAny: (permissions: Permission[]): boolean => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    return hasAnyPermission(user.permissions, permissions);
  },

  // Check if user has all permissions
  canAll: (permissions: Permission[]): boolean => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    return hasAllPermissions(user.permissions, permissions);
  },

  // Check if user has a specific role
  hasRole: (role: string): boolean => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    return user.role === role;
  },
}));

// Hook for easy permission checking
export const usePermission = () => usePermissionStore();

// Hook for use in components
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);
  const { can, canAny, canAll, hasRole } = usePermissionStore();
  
  return {
    user,
    permissions: user?.permissions || [],
    role: user?.role,
    can,
    canAny,
    canAll,
    hasRole,
    isAdmin: user?.role === 'SUPER_ADMIN',
    isHR: user?.role === 'HR_MANAGER',
    isEmployee: user?.role === 'EMPLOYEE',
  };
};
