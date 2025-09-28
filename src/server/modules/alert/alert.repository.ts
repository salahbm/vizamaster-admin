import prisma from '@/server/db/prisma';

export class AlertRepository {
  private readonly prisma = prisma;

  async getUnreadAlertsByUserId(userId: string) {
    return await this.prisma.alert.findMany({
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
                email: true,
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

  async markAllAlertsAsRead(userId: string, applicantId: string) {
    await this.prisma.alert.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    await this.prisma.applicant.update({
      where: { id: applicantId },
      data: { isAlert: false },
    });
  }
}

export const alertRepository = new AlertRepository();
