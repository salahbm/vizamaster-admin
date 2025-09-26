import { ColumnSort } from '@tanstack/react-table';

import { Prisma } from '@/generated/prisma';
import {
  TAdminPasswordDto,
  TAdminProfileDto,
} from '@/server/common/dto/admin.dto';
import { handlePrismaError } from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';

import { AuthGuard } from '../../common/guard/auth.guard';
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

  async updateUser(id: string, data: Prisma.UsersUpdateInput) {
    const updatedUser = await this.authRepository.updateUser(id, data);
    return createResponse(updatedUser);
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
}
