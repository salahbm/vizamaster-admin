import { Codes, Prisma } from '@/generated/prisma';
import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';
import { ISort } from '@/types/data-table';

export class CodesRepository {
  private readonly prisma = prisma;

  // Get all group codes unlinked to user
  async getAllCodes(
    skip: number,
    take: number,
    sort?: ISort,
    search?: string,
    groupCodeId?: string,
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
      : groupCodeId
        ? {
            groupCodeId,
          }
        : {};
    return await this.prisma.codes.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        groupCode: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  async countCodes(search?: string, groupCodeId?: string) {
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
      : groupCodeId
        ? {
            groupCodeId,
          }
        : {};
    return this.prisma.codes.count({ where });
  }

  // Get group code by id
  async getCodeById(id: string) {
    return await this.prisma.codes.findUnique({ where: { id } });
  }

  // Update group code by id
  async updateCodeById(
    id: string,
    data: Omit<Codes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return await this.prisma.codes.update({ where: { id }, data });
  }

  // Create group code
  async createCode(data: Omit<Codes, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.prisma.codes.create({ data });
  }

  // Delete group code by id
  async deleteCodeById(id: string) {
    return await this.prisma.codes.delete({ where: { id } });
  }
}
