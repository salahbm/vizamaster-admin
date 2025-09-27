import { ColumnSort } from '@tanstack/react-table';
import bcrypt from 'bcryptjs';

import { Prisma } from '@/generated/prisma';
import {
  TAdminPasswordDto,
  TAdminProfileDto,
} from '@/server/common/dto/admin.dto';
import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';

export class AuthRepository {
  private readonly prisma = prisma;
  private readonly bcrypt = bcrypt;

  // Users
  findUserById(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  findUserByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  getAllUsers(
    skip = 0,
    take = 50,
    search = '',
    sort?: ColumnSort[] | ColumnSort,
  ) {
    const orderBy = buildOrderBy(sort);

    const where = search
      ? {
          OR: [
            {
              email: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              name: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};

    return this.prisma.users.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  countUsers(search = '') {
    // Use the same search condition as getAllUsers for consistency
    const where = search
      ? {
          OR: [
            {
              email: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              name: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};
    return this.prisma.users.count({ where });
  }

  // Accounts
  findAccountById(id: string) {
    return this.prisma.accounts.findUnique({ where: { id } });
  }

  // UPDATE
  updateUser(id: string, data: Prisma.UsersUpdateInput) {
    return this.prisma.users.update({ where: { id }, data });
  }

  // DELETE
  deleteUser(id: string) {
    return this.prisma.users.delete({ where: { id } });
  }

  // DELETE FROM ACCOUNTS
  async deleteAccount(userId: string) {
    const deletedAccount = await this.prisma.accounts.deleteMany({
      where: { userId },
    });

    return deletedAccount; // Returns { count: number } indicating how many accounts were deleted
  }

  updateProfile(id: string, data: TAdminProfileDto) {
    return this.prisma.users.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
  }

  async updatePassword(id: string, data: TAdminPasswordDto) {
    const account = await this.prisma.accounts.findFirst({
      where: { userId: id },
      select: { id: true, password: true },
    });

    if (!account) throw new Error('Account not found');
    if (!account.password) throw new Error('No password set');

    const isValid = await this.bcrypt.compare(
      data.currentPassword,
      account.password,
    );
    if (!isValid) throw new Error('Current password is incorrect');

    const hashedPassword = await this.bcrypt.hash(data.newPassword, 10);

    return this.prisma.accounts.update({
      where: { id: account.id },
      data: { password: hashedPassword },
      select: { id: true },
    });
  }
}
