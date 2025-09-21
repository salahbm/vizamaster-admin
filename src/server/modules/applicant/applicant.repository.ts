import { Applicant, Prisma, PrismaClient } from '@/generated/prisma';
import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';
import { ISort } from '@/types/data-table';

export class ApplicantRepository {
  private readonly prismaApplicant: PrismaClient['applicant'];

  constructor() {
    this.prismaApplicant = prisma.applicant;
  }

  // Create sidebar
  async createApplicant(
    data: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return await this.prismaApplicant.create({ data });
  }

  // GET ALL APPLICANTS
  async getAllApplicants(
    skip: number,
    take: number,
    sort?: ISort,
    search?: string,
    country?: string,
    partner?: string,
    isArchived?: boolean,
  ) {
    const orderBy = buildOrderBy(sort);

    // Build where conditions
    const where: Prisma.ApplicantWhereInput = {};

    // Add country condition if provided
    if (country) {
      where.countryOfEmployment = country;
    }

    // Add partner condition if provided
    if (partner) {
      where.partner = partner;
    }

    // Add isArchived condition if provided
    if (isArchived !== undefined) {
      where.isArchived = isArchived;
    }

    // Add search condition if provided
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
      ];
    }

    return await this.prismaApplicant.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  }

  async countApplicants(
    search?: string,
    country?: string,
    partner?: string,
    isArchived?: boolean,
  ) {
    // Build where conditions
    const where: Prisma.ApplicantWhereInput = {};

    // Add country condition if provided
    if (country) {
      where.countryOfEmployment = country;
    }

    // Add partner condition if provided
    if (partner) {
      where.partner = partner;
    }

    // Add isArchived condition if provided
    if (isArchived !== undefined) {
      where.isArchived = isArchived;
    }

    // Add search condition if provided
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
      ];
    }

    return this.prismaApplicant.count({ where });
  }
}
