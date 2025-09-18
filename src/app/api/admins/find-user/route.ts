import { NextRequest, NextResponse } from 'next/server';

import {
  BadRequestError,
  NotFoundError,
  handleApiError,
} from '@/server/common/errors';
import { createResponse } from '@/server/common/utils';
import { AuthService } from '@/server/modules/auth';

const authService = new AuthService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('id');

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const user = await authService.findUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return NextResponse.json(createResponse(user));
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
