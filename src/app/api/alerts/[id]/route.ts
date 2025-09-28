import { NextRequest, NextResponse } from 'next/server';

import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { AuthGuard } from '@/server/common/guard/auth.guard';
import { alertService } from '@/server/modules/alert/alert.service';

// Mark a specific alert as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authGuard = new AuthGuard();
  const session = await authGuard.checkSession();

  if (!session) throw new UnauthorizedError('Unauthorized');

  const { id } = await params;

  try {
    const result = await alertService.markAlertAsRead(id, session.user.id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
