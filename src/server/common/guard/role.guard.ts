import { UnauthorizedError } from '../errors';

export enum UserRole {
  creator = 'creator', // owner of the app
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export enum Permission {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

const rolePermissions = {
  [UserRole.creator]: [
    Permission.CREATE,
    Permission.READ,
    Permission.UPDATE,
    Permission.DELETE,
  ],
  [UserRole.ADMIN]: [
    Permission.CREATE,
    Permission.READ,
    Permission.UPDATE,
    Permission.DELETE,
  ],
  [UserRole.EDITOR]: [Permission.CREATE, Permission.READ, Permission.UPDATE],
  [UserRole.USER]: [Permission.CREATE, Permission.READ, Permission.UPDATE],
};

export function checkPermission(
  userRole: UserRole,
  requiredPermission: Permission,
): boolean {
  const permissions = rolePermissions[userRole];
  return permissions?.includes(requiredPermission) ?? false;
}

export function roleGuard(userRole: UserRole, requiredPermission: Permission) {
  return async () => {
    const hasPermission = checkPermission(userRole, requiredPermission);

    if (!hasPermission) {
      throw new UnauthorizedError(
        `User with role ${userRole} does not have permission ${requiredPermission}`,
      );
    }

    return true;
  };
}
