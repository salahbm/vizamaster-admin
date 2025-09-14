import { API_CODES } from '@/server/common/codes';
import { NotFoundError, UnauthorizedError } from '@/server/common/errors';
import { createPaginatedResult } from '@/server/common/utils';

import { Prisma, Users } from '../../../../generated/prisma';
import { AuthRepository } from './auth.repository';

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  async getAllUsers(page = 1, size = 50, search = '') {
    // Ensure page and size are valid numbers
    const validPage =
      typeof page === 'number' && !isNaN(page) && page > 0 ? page : 1;
    const validSize =
      typeof size === 'number' && !isNaN(size) && size > 0 ? size : 50;
    const skip = Math.max(0, (validPage - 1) * validSize);

    const [users, total] = await Promise.all([
      this.authRepository.getAllUsers(skip, validSize, search),
      this.authRepository.countUsers(search),
    ]);

    return createPaginatedResult(users, total, {
      page: validPage,
      size: validSize,
    });
  }

  async findUserById(id: string) {
    const user = await this.authRepository.findUserById(id);
    if (!user) throw new NotFoundError('User not found', API_CODES.NOT_FOUND);
    return user;
  }

  async updateUser(id: string, data: Prisma.UsersUpdateInput) {
    return this.authRepository.updateUser(id, data);
  }

  async checkApproval(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundError('User not found', API_CODES.NOT_FOUND);

    if (!user.active && user.role === 'USER') {
      throw new UnauthorizedError(
        'Account pending admin approval',
        API_CODES.NOT_AUTHORIZED_ROLE,
      );
    }

    return user;
  }

  requireRole(user: Users, allowedRoles: string[]) {
    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedError(
        'You are not authorized to perform this action',
        API_CODES.NOT_AUTHORIZED_ROLE,
      );
    }
  }
}
