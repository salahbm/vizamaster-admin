import { Applicant, Prisma, PrismaClient } from '@/generated/prisma';
import { buildOrderBy } from '@/server/common/utils';
import prisma from '@/server/db/prisma';
import { ISort } from '@/types/data-table';

import { ApplicantHelper } from './applicant.helper';

export class ApplicantRepository {
  private readonly prismaApplicant: PrismaClient['applicant'];
  private readonly prismaWork: PrismaClient['work'];
  private readonly prismaFile: PrismaClient['file'];
  private readonly prismaVisa: PrismaClient['visa'];
  private readonly applicantHelper: ApplicantHelper;

  constructor() {
    this.prismaApplicant = prisma.applicant;
    this.prismaWork = prisma.work;
    this.prismaFile = prisma.file;
    this.prismaVisa = prisma.visa;
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
    status?: string,
    jobTitle?: string,
  ) {
    const orderBy = buildOrderBy(sort);

    // Build where conditions
    const where: Prisma.ApplicantWhereInput =
      this.applicantHelper.buildWhereClause({
        search,
        country,
        partner,
        isArchived,
        status,
        jobTitle,
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
    status?: string,
    jobTitle?: string,
  ) {
    // Build where conditions
    const where: Prisma.ApplicantWhereInput =
      this.applicantHelper.buildWhereClause({
        search,
        country,
        partner,
        isArchived,
        status,
        jobTitle,
      });

    return this.prismaApplicant.count({ where });
  }

  // ───────────────── GET APPLICANT BY ID ────────────────── //
  async getApplicantById(id: string) {
    return await this.prismaApplicant.findUnique({ where: { id } });
  }

  async getApplicantWork(applicantId: string) {
    return await this.prismaWork.findMany({ where: { applicantId } });
  }

  async getApplicantFiles(applicantId: string) {
    return await this.prismaFile.findMany({ where: { applicantId } });
  }

  async getApplicantVisa(applicantId: string) {
    return await this.prismaVisa.findMany({ where: { applicantId } });
  }
}
