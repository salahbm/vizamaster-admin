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
    // Ensure skip and take are valid numbers
    const validSkip = typeof skip === 'number' && !isNaN(skip) ? skip : 0;
    const validTake = typeof take === 'number' && !isNaN(take) ? take : 50;

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
      skip: validSkip,
      take: validTake,
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

  // Sessions
  findSessionById(id: string) {
    return this.prisma.sessions.findUnique({ where: { id } });
  }

  // UPDATE
  updateUser(id: string, data: Prisma.UsersUpdateInput) {
    return this.prisma.users.update({ where: { id }, data });
  }
}
