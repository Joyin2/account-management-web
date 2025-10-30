// Role-based access control types and permissions

export type UserRole = 'admin' | 'hr_manager' | 'manager' | 'employee';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Define permissions for each role
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      { resource: 'employees', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'salary', actions: ['create', 'read', 'update', 'delete', 'process'] },
      { resource: 'leaves', actions: ['create', 'read', 'update', 'delete', 'approve', 'reject'] },
      { resource: 'attendance', actions: ['create', 'read', 'update', 'delete', 'mark'] },
      { resource: 'reports', actions: ['read', 'export'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] }
    ]
  },
  {
    role: 'hr_manager',
    permissions: [
      { resource: 'employees', actions: ['create', 'read', 'update'] },
      { resource: 'salary', actions: ['create', 'read', 'update', 'process'] },
      { resource: 'leaves', actions: ['read', 'approve', 'reject'] },
      { resource: 'attendance', actions: ['read', 'mark'] },
      { resource: 'reports', actions: ['read', 'export'] }
    ]
  },
  {
    role: 'manager',
    permissions: [
      { resource: 'employees', actions: ['read'] },
      { resource: 'salary', actions: ['read'] },
      { resource: 'leaves', actions: ['read', 'approve', 'reject'] },
      { resource: 'attendance', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ]
  },
  {
    role: 'employee',
    permissions: [
      { resource: 'employees', actions: ['read'] }, // Only own profile
      { resource: 'salary', actions: ['read'] }, // Only own salary
      { resource: 'leaves', actions: ['create', 'read'] }, // Only own leaves
      { resource: 'attendance', actions: ['create', 'read'] }, // Only own attendance
      { resource: 'reports', actions: [] } // No access to reports
    ]
  }
];

// Helper functions for permission checking
export const hasPermission = (userRole: UserRole, resource: string, action: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === userRole);
  if (!rolePermissions) return false;

  const resourcePermission = rolePermissions.permissions.find(p => p.resource === resource);
  if (!resourcePermission) return false;

  return resourcePermission.actions.includes(action);
};

export const canAccessResource = (userRole: UserRole, resource: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === userRole);
  if (!rolePermissions) return false;

  return rolePermissions.permissions.some(p => p.resource === resource && p.actions.length > 0);
};

export const getResourceActions = (userRole: UserRole, resource: string): string[] => {
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === userRole);
  if (!rolePermissions) return [];

  const resourcePermission = rolePermissions.permissions.find(p => p.resource === resource);
  return resourcePermission ? resourcePermission.actions : [];
};

// Role hierarchy for inheritance (higher roles inherit lower role permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  hr_manager: 3,
  manager: 2,
  employee: 1
};

export const hasHigherRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// UI display names for roles
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  hr_manager: 'HR Manager',
  manager: 'Manager',
  employee: 'Employee'
};

// Role colors for UI
export const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800',
  hr_manager: 'bg-blue-100 text-blue-800',
  manager: 'bg-green-100 text-green-800',
  employee: 'bg-gray-100 text-gray-800'
};
