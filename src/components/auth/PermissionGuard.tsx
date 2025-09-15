'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/roles';
import { AlertTriangle, Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  resource?: string;
  action?: string;
  role?: UserRole;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export default function PermissionGuard({
  children,
  resource,
  action,
  role,
  fallback,
  showFallback = true
}: PermissionGuardProps) {
  const { checkPermission, checkRoleHierarchy } = usePermissions();

  let hasAccess = true;

  // Check resource and action permission
  if (resource && action) {
    hasAccess = checkPermission(resource, action);
  }

  // Check role hierarchy
  if (role && hasAccess) {
    hasAccess = checkRoleHierarchy(role);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showFallback) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-sm text-gray-500">
            You don't have permission to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// Specific permission guard components for common use cases
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard role="admin" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const HRManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard role="hr_manager" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const ManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard role="manager" fallback={fallback}>
    {children}
  </PermissionGuard>
);

// Resource-specific guards
export const EmployeeCreateGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard resource="employees" action="create" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const PayrollProcessGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard resource="salary" action="process" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const LeaveApprovalGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard resource="leaves" action="approve" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const ReportsGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard resource="reports" action="read" fallback={fallback}>
    {children}
  </PermissionGuard>
);

// Hook for conditional rendering based on permissions
export const useConditionalRender = () => {
  const permissions = usePermissions();

  const renderIf = (condition: boolean, component: React.ReactNode, fallback?: React.ReactNode) => {
    return condition ? component : (fallback || null);
  };

  const renderIfPermission = (
    resource: string, 
    action: string, 
    component: React.ReactNode, 
    fallback?: React.ReactNode
  ) => {
    return renderIf(permissions.checkPermission(resource, action), component, fallback);
  };

  const renderIfRole = (
    role: UserRole, 
    component: React.ReactNode, 
    fallback?: React.ReactNode
  ) => {
    return renderIf(permissions.checkRoleHierarchy(role), component, fallback);
  };

  return {
    renderIf,
    renderIfPermission,
    renderIfRole
  };
};
