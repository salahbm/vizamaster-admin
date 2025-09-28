import { NotFoundError, handlePrismaError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';

import { alertRepository } from './alert.repository';

export class AlertService {
  constructor(private readonly repository = alertRepository) {}

  async getUnreadAlertsByUserId(userId: string) {
    try {
      const alerts = await this.repository.getUnreadAlertsByUserId(userId);
      return createResponse(alerts);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async markAlertAsRead(alertId: string, userId: string) {
    try {
      const result = await this.repository.markAlertAsRead(alertId, userId);

      if (result.count === 0) {
        throw new NotFoundError('Alert not found or already read');
      }

      return createResponse({ success: true });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async markAllAlertsAsRead(userId: string, applicantId: string) {
    try {
      await this.repository.markAllAlertsAsRead(userId, applicantId);
      return createResponse({ success: true });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export const alertService = new AlertService();
