import { NextRequest, NextResponse } from 'next/server';

import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { AuthGuard } from '@/server/common/guard/auth.guard';
import { alertService } from '@/server/modules/alert/alert.service';

// Get unread alerts for current user
export async function GET(req: NextRequest) {
  const authGuard = new AuthGuard();
  const session = await authGuard.checkSession();

  if (!session) throw new UnauthorizedError('Unauthorized');

  try {
    const alerts = await alertService.getUnreadAlertsByUserId(session.user.id);
    return NextResponse.json(alerts);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// Mark all alerts as read
export async function PATCH(req: NextRequest) {
  const authGuard = new AuthGuard();
  const session = await authGuard.checkSession();

  if (!session) throw new UnauthorizedError('Unauthorized');

  try {
    const result = await alertService.markAllAlertsAsRead(session.user.id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
