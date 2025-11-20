import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { authGuard } from '@/server/common/guard/auth.guard';
import { parsePaginationAndSortParams } from '@/server/common/utils';
import { AuthService } from '@/server/modules/auth';

const authService = new AuthService();

// GET /api/admins
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await authGuard.requireAuth();

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
