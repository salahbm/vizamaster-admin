import { NextRequest, NextResponse } from 'next/server';

import { getTranslations } from 'next-intl/server';

import { NotFoundError, UnauthorizedError } from '@/server/common/errors';
import { auth } from '@/server/modules/auth/auth';
import { AuthGuard } from '@/server/modules/auth/auth.guard';
import { AuthService } from '@/server/modules/auth/auth.service';

const authGuard = new AuthGuard();
const authService = new AuthService();

// PATCH /api/admins/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) throw new UnauthorizedError();

    const user = await authService.findUserById(session.user.id);

    if (!user) throw new NotFoundError();

    // Check if user has admin role
    await authGuard.requireRole({ role: user.role }, ['ADMIN', 'CREATOR']);

    // Get request body
    const body = await request.json();

    // Update user
    const updatedUser = await authService.updateUser(params.id, body);

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    const t = await getTranslations();

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || t('errors.somethingWentWrong') },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: t('errors.somethingWentWrong') },
      { status: 500 },
    );
  }
}
