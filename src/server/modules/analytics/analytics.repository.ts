import { PrismaClient } from '@/generated/prisma';

export class AnalyticsRepository {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getDashboardData(dateRange: { from: Date; to: Date }) {
    return this.prisma.applicant.findMany({
      where: {
        createdAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
        isArchived: false,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        countryOfEmployment: true,
        partner: true,
        visa: {
          select: {
            status: true,
            issueDate: true,
            departureDate: true,
            returnedDate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
