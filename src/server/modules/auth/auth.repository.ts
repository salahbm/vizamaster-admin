import prisma from '@/server/db/prisma';

import { Prisma } from '../../../../generated/prisma';

export class AuthRepository {
  private readonly prisma = prisma;

  // Users
  findUserById(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  findUserByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  getAllUsers(skip = 0, take = 50, search = '') {
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
      orderBy: { createdAt: 'desc' },
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
}
