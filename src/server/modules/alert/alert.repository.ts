import prisma from '@/server/db/prisma';

export class AlertRepository {
  private readonly prisma = prisma;

  async getUnreadAlertsByUserId(userId: string) {
    return this.prisma.alert.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        comment: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                countryOfEmployment: true,
                partner: true,
              },
            },
          },
        },
      },
    });
  }

  async markAlertAsRead(alertId: string, userId: string) {
    return this.prisma.alert.updateMany({
      where: {
        id: alertId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAlertsAsRead(userId: string) {
    return this.prisma.alert.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadAlertCount(userId: string) {
    return this.prisma.alert.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async hasUnreadAlerts(applicantId: string, userId: string) {
    const count = await this.prisma.alert.count({
      where: {
        userId,
        isRead: false,
        comment: {
          applicantId,
        },
      },
    });

    return count > 0;
  }
}

export const alertRepository = new AlertRepository();
