import { PrismaClient } from '@/generated/prisma';
import { TWorkArraySchema } from '@/server/common/dto/work.dto';
import { handlePrismaError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';
import prisma from '@/server/db/prisma';

export class WorkRepository {
  private readonly prismaWork: PrismaClient['work'];

  constructor() {
    this.prismaWork = prisma.work;
  }

  async createMany(
    workExperiences: TWorkArraySchema['workExperiences'],
    applicantId: string,
  ) {
    try {
      const works = await this.prismaWork.createMany({
        data: workExperiences.map((work) => ({
          ...work,
          applicantId,
        })),
      });
      return createResponse(works);
    } catch (error) {
      handlePrismaError(error, 'Work');
    }
  }

  async updateMany(
    workExperiences: TWorkArraySchema['workExperiences'],
    applicantId: string,
  ) {
    try {
      // First delete all existing work experiences
      await this.prismaWork.deleteMany({
        where: { applicantId },
      });

      // Then create new ones
      const works = await this.createMany(workExperiences, applicantId);
      return createResponse(works);
    } catch (error) {
      handlePrismaError(error, 'Work');
    }
  }

  async findMany(applicantId: string) {
    try {
      const works = await this.prismaWork.findMany({
        where: { applicantId },
        orderBy: { startDate: 'desc' },
      });
      return createResponse(works);
    } catch (error) {
      handlePrismaError(error, 'Work');
    }
  }

  async deleteOne(applicantId: string, id: string) {
    try {
      return await this.prismaWork.delete({
        where: { applicantId, id },
      });
    } catch (error) {
      handlePrismaError(error, 'Work');
    }
  }

  async deleteMany(applicantId: string) {
    try {
      return await this.prismaWork.deleteMany({
        where: { applicantId },
      });
    } catch (error) {
      handlePrismaError(error, 'Work');
    }
  }
}
