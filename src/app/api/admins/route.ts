import { NextRequest, NextResponse } from 'next/server';

import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { parsePaginationAndSortParams } from '@/server/common/utils';
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

    const { page, size, sort } = parsePaginationAndSortParams(searchParams);

    // Get users
    const result = await authService.getAllUsers(page, size, search, sort);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
