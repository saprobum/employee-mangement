import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../store/permissionStore';
import { useAuthLoading } from '../store/authStore';
import { PageLoading } from './common/Loading';
import type { Permission } from '../types/auth';

interface PermissionRouteProps {
  children: React.ReactNode;
  permission: Permission;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ children, permission }) => {
  const { can } = usePermission();
  const isLoading = useAuthLoading();

  if (isLoading) {
    return <PageLoading />;
  }

  if (!can(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PermissionRoute;
