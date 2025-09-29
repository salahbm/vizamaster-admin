import { handlePrismaError } from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';

import { AnalyticsRepository } from './analytics.repository';

export class AnalyticsService {
  private readonly repository: AnalyticsRepository;
  constructor() {
    this.repository = new AnalyticsRepository();
  }

  async getDashboardData(dateRange: { from: Date; to: Date }) {
    try {
      const data = await this.repository.getDashboardData(dateRange);

      return createResponse(data);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
