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

  async markAllAlertsAsRead(userId: string) {
    try {
      const result = await this.repository.markAllAlertsAsRead(userId);
      return createResponse({ count: result.count });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async getUnreadAlertCount(userId: string) {
    try {
      const count = await this.repository.getUnreadAlertCount(userId);
      return createResponse({ count });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async hasUnreadAlerts(applicantId: string, userId: string) {
    try {
      const hasAlerts = await this.repository.hasUnreadAlerts(
        applicantId,
        userId,
      );
      return createResponse({ hasAlerts });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export const alertService = new AlertService();
