import { NextRequest } from 'next/server';

import { ColumnSort } from '@tanstack/react-table';

import { API_CODES } from '@/server/common/codes';
import { NotFoundError, UnauthorizedError } from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';

import { Prisma, Users } from '../../../../generated/prisma';
import { auth } from './auth';
import { AuthGuard } from './auth.guard';
import { AuthRepository } from './auth.repository';

export class AuthService {
  constructor(
    private readonly authRepository = new AuthRepository(),
    private readonly authGuard = new AuthGuard(),
  ) {}

  async getAllUsers(
    page = 1,
    size = 50,
    search = '',
    sort?: ColumnSort[] | ColumnSort,
  ) {
    // Calculate skip based on page and size
    const skip = Math.max(0, (page - 1) * size);

    const [users, total] = await Promise.all([
      this.authRepository.getAllUsers(skip, size, search, sort),
      this.authRepository.countUsers(search),
    ]);
    const paginatedData = createPaginatedResult(users, total, { page, size });
    return createResponse(paginatedData);
  }

  async findUserById(id: string) {
    return await this.authRepository.findUserById(id);
  }

  async updateUser(id: string, data: Prisma.UsersUpdateInput) {
    const updatedUser = await this.authRepository.updateUser(id, data);
    return createResponse(updatedUser);
  }

  async deleteUser(id: string) {
    const deletedUser = await this.authRepository.deleteUser(id);
    return createResponse(deletedUser);
  }

  async checkAuth(request: NextRequest) {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) throw new UnauthorizedError();

    const user = await this.findUserById(session.user.id);

    if (!user) throw new NotFoundError();

    // Check if user has admin role
    await this.authGuard.requireRole({ role: user.role }, ['ADMIN', 'CREATOR']);

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
