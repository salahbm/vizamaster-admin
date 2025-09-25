import { PrismaClient } from '@/generated/prisma';
import { TVisaDto } from '@/server/common/dto/visa.dto';
import prisma from '@/server/db/prisma';

export class VisaRepository {
  private readonly prismaVisa: PrismaClient['visa'];

  constructor() {
    this.prismaVisa = prisma.visa;
  }

  async update(visaData: TVisaDto, applicantId: string) {
    // First check if a visa record exists
    const existingVisa = await this.prismaVisa.findFirst({
      where: { applicantId },
    });

    if (existingVisa) {
      // Update existing visa
      return await this.prismaVisa.update({
        where: { id: existingVisa.id },
        data: {
          ...visaData,
          applicantId,
        },
      });
    } else {
      // Create new visa
      return await this.prismaVisa.create({
        data: {
          ...visaData,
          applicantId,
        },
      });
    }
  }

  async findOne(applicantId: string) {
    return await this.prismaVisa.findFirst({
      where: { applicantId },
    });
  }

  async delete(applicantId: string) {
    return await this.prismaVisa.deleteMany({
      where: { applicantId },
    });
  }
}
