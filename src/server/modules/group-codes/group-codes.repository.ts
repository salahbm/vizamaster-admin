import { GroupCodes, Prisma, Sidebar } from '@/generated/prisma';
import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';
import { ISort } from '@/types/data-table';

export class GroupCodesRepository {
  private readonly prisma = prisma;

  // Get all group codes unlinked to user
  async getAllGroupCodes(
    sort?: ISort,
    search?: string,
    skip?: number,
    take?: number,
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
      : {};
    return await this.prisma.groupCodes.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  }

  async countGroupCodes(search?: string) {
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
      : {};
    return this.prisma.groupCodes.count({ where });
  }

  // Get group code by id
  async getGroupCodeById(id: string) {
    return await this.prisma.groupCodes.findUnique({ where: { id } });
  }

  // Update group code by id
  async updateGroupCodeById(id: string, data: Sidebar) {
    return await this.prisma.groupCodes.update({ where: { id }, data });
  }

  // Create group code
  async createGroupCode(
    data: Omit<GroupCodes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return await this.prisma.groupCodes.create({ data });
  }

  // Delete group code by id
  async deleteGroupCodeById(id: string) {
    return await this.prisma.groupCodes.delete({ where: { id } });
  }
}
