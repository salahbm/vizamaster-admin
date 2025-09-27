import { ColumnSort } from '@tanstack/react-table';

import { Prisma, PrismaClient } from '@/generated/prisma';
import {
  TAdminPasswordDto,
  TAdminProfileDto,
} from '@/server/common/dto/admin.dto';
import { NotFoundError, handlePrismaError } from '@/server/common/errors';
import { createPaginatedResult, createResponse } from '@/server/common/utils';

import { AuthRepository } from './auth.repository';

export class AuthService {
  constructor(
    private readonly authRepository = new AuthRepository(),
    private readonly prisma = new PrismaClient(),
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
      throw handlePrismaError(error);
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
      throw handlePrismaError(error);
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await this.prisma.$transaction(
        async (prisma) => {
          // Step 1: Delete related records in sidebar_user
          await prisma.sidebarUser.deleteMany({
            where: { userId: id },
          });

          // Step 2: Delete the user
          const deletedUser = await prisma.users.delete({
            where: { id },
            select: { id: true }, // Select only necessary fields
          });

          if (!deletedUser) throw new NotFoundError('User not found');

          // Step 3: Delete the account
          const deletedAccount = await prisma.accounts.deleteMany({
            where: { userId: id },
          });

          return { deletedUser, deletedAccount };
        },
        { timeout: 10000 }, // Increase timeout to 10 seconds
      );

      // Return a JSON-serializable response
      return createResponse(
        {
          deletedUser: { id: result.deletedUser.id },
          deletedAccount: { count: result.deletedAccount.count },
        },
        200,
        'User deleted successfully',
      );
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
