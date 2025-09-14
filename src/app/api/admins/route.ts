import { NextRequest, NextResponse } from 'next/server';

import { getTranslations } from 'next-intl/server';

import { UnauthorizedError } from '@/server/common/errors';
import { parsePaginationParams } from '@/server/common/utils';
import { AuthService } from '@/server/modules/auth';
import { auth } from '@/server/modules/auth/auth';

const authService = new AuthService();

// GET /api/admins
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) throw new UnauthorizedError();

    await authService.checkAuth(request);

    // Get query parameters
    const searchParams = new URL(request.url).searchParams;

    const search = searchParams.get('search') || '';

    const { page, size } = parsePaginationParams(searchParams);

    // Get users
    const result = await authService.getAllUsers(page, size, search);
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
