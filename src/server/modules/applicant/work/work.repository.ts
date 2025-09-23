import { PrismaClient } from '@/generated/prisma';
import prisma from '@/server/db/prisma';

export class ApplicantRepository {
  private readonly prismaApplicant: PrismaClient['applicant'];
  private readonly prismaWork: PrismaClient['work'];

  constructor() {
    this.prismaApplicant = prisma.applicant;
    this.prismaWork = prisma.work;
  }
}
