import { NextRequest, NextResponse } from 'next/server';

import { getTranslations } from 'next-intl/server';

import { UnauthorizedError } from '@/server/common/errors';
import { parsePaginationParams } from '@/server/common/utils';
import { AuthService } from '@/server/modules/auth';
import { auth } from '@/server/modules/auth/auth';
import { AuthGuard } from '@/server/modules/auth/auth.guard';

const authGuard = new AuthGuard();
const authService = new AuthService();

// GET /api/admins
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) throw new UnauthorizedError();

    const user = await authService.findUserById(session.user.id);

    if (!user) throw new UnauthorizedError();
    const start = performance.now();
    // Check if user has admin role
    await authGuard.requireRole(user, ['ADMIN', 'CREATOR']);

    // Get query parameters
    const searchParams = new URL(request.url).searchParams;

    const search = searchParams.get('search') || '';
    const { page, size } = parsePaginationParams(searchParams);

    // Get users
    const result = await authService.getAllUsers(page, size, search);
    const end = performance.now();
    console.log('Time taken:', end - start);
    return NextResponse.json(result);
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
