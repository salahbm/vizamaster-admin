import { Applicant, PrismaClient } from '@/generated/prisma';
import prisma from '@/server/db/prisma';

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
}
