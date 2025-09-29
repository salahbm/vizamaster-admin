import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { AnalyticsService } from '@/server/modules/analytics/analytics.service';

const analyticsService = new AnalyticsService();

// Get unread alerts for current user
export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get('from');
  const to = req.nextUrl.searchParams.get('to');

  if (!from || !to) throw new Error('from and to are required');

  try {
    const alerts = await analyticsService.getDashboardData({
      from: new Date(from),
      to: new Date(to),
    });
    return NextResponse.json(alerts);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
