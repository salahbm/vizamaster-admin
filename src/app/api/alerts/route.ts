import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { alertService } from '@/server/modules/alert/alert.service';

// Get unread alerts for current user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) throw new Error('User ID is required');

  try {
    const alerts = await alertService.getUnreadAlertsByUserId(userId);
    return NextResponse.json(alerts);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// Mark all alerts as read
export async function PATCH(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const userId = searchParams.get('userId');
  const applicantId = searchParams.get('applicantId');

  if (!applicantId || !userId) throw new Error('Applicant ID is required');

  try {
    const result = await alertService.markAllAlertsAsRead(userId, applicantId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
