import { NextRequest, NextResponse } from 'next/server';

import { getTranslations } from 'next-intl/server';

import { UnauthorizedError } from '@/server/common/errors';
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

    // Check if user has admin role
    await authGuard.requireRole(user, ['ADMIN', 'CREATOR']);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;

    // Parse page and size parameters, ensuring they are valid numbers
    let page = 1;
    try {
      const pageParam = searchParams.get('page');
      if (pageParam) {
        const parsedPage = parseInt(pageParam, 10);
        if (!isNaN(parsedPage) && parsedPage > 0) {
          page = parsedPage;
        }
      }
    } catch (e) {
      // Default to page 1 if parsing fails
    }

    let size = 50;
    try {
      const sizeParam = searchParams.get('size');
      if (sizeParam) {
        const parsedSize = parseInt(sizeParam, 10);
        if (!isNaN(parsedSize) && parsedSize > 0) {
          size = parsedSize;
        }
      }
    } catch (e) {
      // Default to size 50 if parsing fails
    }

    const search = searchParams.get('search') || '';
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
