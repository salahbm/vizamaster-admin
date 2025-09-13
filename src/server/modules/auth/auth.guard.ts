import { API_CODES } from '@/server/common/codes';
import { UnauthorizedError } from '@/server/common/errors';

export class AuthGuard {
  requireRole(user: { role: string }, allowedRoles: string[]) {
    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedError(
        'You are not authorized to perform this action',
        API_CODES.NOT_AUTHORIZED_ROLE,
      );
    }
  }
}
