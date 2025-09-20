import { GroupCodes, Prisma, PrismaClient, Sidebar } from '@/generated/prisma';
import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';
import { ISort } from '@/types/data-table';

export class GroupCodesRepository {
  private readonly prisma: PrismaClient['groupCodes'];

  constructor() {
    this.prisma = prisma.groupCodes;
  }

  // Get all group codes unlinked to user
  async getAllGroupCodes(
    sort?: ISort,
    search?: string,
    skip?: number,
    take?: number,
    code?: string,
  ) {
    const orderBy = buildOrderBy(sort);

    const where = search
      ? {
          OR: [
            {
              labelEn: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              labelRu: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          ],
        }
      : code
        ? {
            code: {
              equals: code,
            },
          }
        : {};
    return await this.prisma.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  }

  async countGroupCodes(search?: string, code?: string) {
    const where = search
      ? {
          OR: [
            {
              labelEn: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              labelRu: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          ],
        }
      : code
        ? {
            code: {
              equals: code,
            },
          }
        : {};
    return this.prisma.count({ where });
  }

  // Get group code by id
  async getGroupCodeById(id: string) {
    return await this.prisma.findUnique({ where: { id } });
  }

  // Update group code by id
  async updateGroupCodeById(id: string, data: Sidebar) {
    return await this.prisma.update({ where: { id }, data });
  }

  // Create group code
  async createGroupCode(
    data: Omit<GroupCodes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return await this.prisma.create({ data });
  }

  // Delete group code by id
  async deleteGroupCodeById(id: string) {
    return await this.prisma.delete({ where: { id } });
  }
}
