import { Applicant, Prisma, PrismaClient } from '@/generated/prisma';
import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';
import { ISort } from '@/types/data-table';

import { ApplicantHelper } from './user-info.helper';

export class ApplicantRepository {
  private readonly prismaApplicant: PrismaClient['applicant'];
  private readonly applicantHelper: ApplicantHelper;

  constructor() {
    this.prismaApplicant = prisma.applicant;
    this.applicantHelper = new ApplicantHelper();
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
    isAlert?: boolean,
    status?: string,
    workplace?: string,
    jobTitle?: string,
    userId?: string,
  ) {
    const orderBy = buildOrderBy(sort);

    // Build where conditions
    const where: Prisma.ApplicantWhereInput =
      this.applicantHelper.buildWhereClause({
        search,
        country,
        partner,
        isArchived,
        isAlert,
        status,
        workplace,
        jobTitle,
        userId,
      });

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
    isAlert?: boolean,
    status?: string,
    workplace?: string,
    jobTitle?: string,
    userId?: string,
  ) {
    // Build where conditions
    const where: Prisma.ApplicantWhereInput =
      this.applicantHelper.buildWhereClause({
        search,
        country,
        partner,
        isArchived,
        isAlert,
        status,
        workplace,
        jobTitle,
        userId,
      });

    return this.prismaApplicant.count({ where });
  }

  // ───────────────── GET APPLICANT BY ID ────────────────── //
  async getApplicantById(id: string) {
    return await this.prismaApplicant.findUnique({
      where: { id },
      include: { work: true, visa: true, files: true },
    });
  }

  // ───────────────── UPDATE APPLICANT ────────────────── //
  async updateApplicant(id: string, data: Applicant) {
    return await this.prismaApplicant.update({ where: { id }, data });
  }

  // ───────────────── DELETE APPLICANTS ────────────────── //
  async deleteApplicants(ids: string[]) {
    return await this.prismaApplicant.deleteMany({
      where: { id: { in: ids } },
    });
  }

  // ───────────────── ARCHIVE APPLICANTS ────────────────── //
  async archiveApplicants(ids: string[]) {
    return await this.prismaApplicant.updateMany({
      where: { id: { in: ids } },
      data: { isArchived: true },
    });
  }

  // ───────────────── UNARCHIVE APPLICANTS ────────────────── //
  async unarchiveApplicants(ids: string[]) {
    return await this.prismaApplicant.updateMany({
      where: { id: { in: ids } },
      data: { isArchived: false },
    });
  }

  // ───────────────── GET APPLICANT CSV ────────────────── //
  async getApplicantCsv(id: string) {
    return await this.prismaApplicant.findUnique({
      where: { id },
      include: { work: true, visa: true, files: true },
    });
  }

  async findAllApplicantsForXml() {
    return this.prismaApplicant.findMany({
      where: { isArchived: false }, // Optional: Exclude archived applicants for active data
      include: {
        visa: {
          select: {
            status: true,
            issueDate: true,
            departureDate: true,
            arrived: true,
            arrivalDate: true,
            returnedDate: true,
          },
        },
        work: {
          select: {
            jobTitle: true,
            company: true,
            startDate: true,
            endDate: true,
            responsibilities: true,
            achievements: true,
            location: true,
          },
        },
      },
    });
  }
}
