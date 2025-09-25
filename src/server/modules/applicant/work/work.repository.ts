import { PrismaClient } from '@/generated/prisma';
import { TWorkArraySchema } from '@/server/common/dto/work.dto';
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
    return await this.prismaWork.createMany({
      data: workExperiences.map((work) => ({
        ...work,
        applicantId,
      })),
    });
  }

  async updateMany(
    workExperiences: TWorkArraySchema['workExperiences'],
    applicantId: string,
  ) {
    // First delete all existing work experiences
    await this.prismaWork.deleteMany({
      where: { applicantId },
    });

    // Then create new ones
    return await this.createMany(workExperiences, applicantId);
  }

  async findMany(applicantId: string) {
    try {
      const works = await this.prismaWork.findMany({
        where: { applicantId },
        orderBy: { startDate: 'desc' },
      });
      return works || [];
    } catch (error) {
      console.error('Error fetching work experiences:', error);
      return [];
    }
  }

  async deleteOne(applicantId: string, id: string) {
    return await this.prismaWork.delete({
      where: { applicantId, id },
    });
  }

  async deleteMany(applicantId: string) {
    return await this.prismaWork.deleteMany({
      where: { applicantId },
    });
  }
}
