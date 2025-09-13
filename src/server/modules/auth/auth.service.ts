// auth.service.ts
import { API_CODES } from '@/server/common/codes';
import { NotFoundError, UnauthorizedError } from '@/server/common/errors';
import prisma from '@/server/db/prisma';

export class AuthService {
  private readonly prisma = prisma;

  constructor() {}

  async checkApproval(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found', API_CODES.NOT_FOUND);
    if (!user.active)
      throw new UnauthorizedError(
        'Account pending admin approval',
        API_CODES.NOT_AUTHORIZED_ROLE,
      );
    return user;
  }

  requireRole(user: { role: string }, allowedRoles: string[]) {
    if (!allowedRoles.includes(user.role))
      throw new UnauthorizedError(
        'You are not authorized to perform this action',
        API_CODES.NOT_AUTHORIZED_ROLE,
      );
  }
}
