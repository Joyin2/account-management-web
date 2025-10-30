import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, canAccessResource, getResourceActions, hasHigherRole, UserRole } from '@/types/roles';

export const usePermissions = () => {
  const { userProfile } = useAuth();

  const userRole = userProfile?.role as UserRole || 'employee';

  const checkPermission = (resource: string, action: string): boolean => {
    return hasPermission(userRole, resource, action);
  };

  const checkResourceAccess = (resource: string): boolean => {
    return canAccessResource(userRole, resource);
  };

  const getActions = (resource: string): string[] => {
    return getResourceActions(userRole, resource);
  };

  const checkRoleHierarchy = (requiredRole: UserRole): boolean => {
    return hasHigherRole(userRole, requiredRole);
  };

  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  const isHRManager = (): boolean => {
    return userRole === 'hr_manager' || isAdmin();
  };

  const isManager = (): boolean => {
    return userRole === 'manager' || isHRManager();
  };

  const isEmployee = (): boolean => {
    return userRole === 'employee';
  };

  // Specific permission checks for common operations
  const canCreateEmployee = (): boolean => {
    return checkPermission('employees', 'create');
  };

  const canEditEmployee = (): boolean => {
    return checkPermission('employees', 'update');
  };

  const canDeleteEmployee = (): boolean => {
    return checkPermission('employees', 'delete');
  };

  const canProcessPayroll = (): boolean => {
    return checkPermission('salary', 'process');
  };

  const canApproveLeaves = (): boolean => {
    return checkPermission('leaves', 'approve');
  };

  const canMarkAttendance = (): boolean => {
    return checkPermission('attendance', 'mark');
  };

  const canViewReports = (): boolean => {
    return checkResourceAccess('reports');
  };

  const canExportReports = (): boolean => {
    return checkPermission('reports', 'export');
  };

  const canManageSettings = (): boolean => {
    return checkPermission('settings', 'update');
  };

  const canManageUsers = (): boolean => {
    return checkPermission('users', 'create');
  };

  return {
    userRole,
    checkPermission,
    checkResourceAccess,
    getActions,
    checkRoleHierarchy,
    isAdmin,
    isHRManager,
    isManager,
    isEmployee,
    canCreateEmployee,
    canEditEmployee,
    canDeleteEmployee,
    canProcessPayroll,
    canApproveLeaves,
    canMarkAttendance,
    canViewReports,
    canExportReports,
    canManageSettings,
    canManageUsers
  };
};
