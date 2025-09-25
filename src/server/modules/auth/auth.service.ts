import { NextRequest } from 'next/server';

import { ColumnSort } from '@tanstack/react-table';

import {
  TAdminPasswordDto,
  TAdminProfileDto,
} from '@/server/common/dto/admin.dto';
import {
  NotFoundError,
  UnauthorizedError,
  handlePrismaError,
} from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';

import { AuthGuard } from '../../common/guard/auth.guard';
import { auth } from './auth';
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

  async updateProfile(id: string, data: TAdminProfileDto) {
    try {
      const updatedProfile = await this.authRepository.updateProfile(id, data);
      return createResponse(updatedProfile);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updatePassword(id: string, data: TAdminPasswordDto) {
    try {
      const updatedPassword = await this.authRepository.updatePassword(
        id,
        data,
      );
      return createResponse(updatedPassword);
    } catch (error) {
      handlePrismaError(error);
    }
  }
  async deleteUser(id: string) {
    try {
      const deletedUser = await this.authRepository.deleteUser(id);
      return createResponse(deletedUser);
    } catch (error) {
      handlePrismaError(error);
    }
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
}
