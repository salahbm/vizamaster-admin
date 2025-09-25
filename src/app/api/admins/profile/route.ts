import { NextRequest, NextResponse } from 'next/server';

import { AdminProfileDto } from '@/server/common/dto/admin.dto';
import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { auth } from '@/server/modules/auth/auth';
import { AuthService } from '@/server/modules/auth/auth.service';

const authService = new AuthService();

export const PUT = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session?.user?.id) throw new UnauthorizedError('Unauthorized');

    const body = await req.json();
    const validatedData = AdminProfileDto.parse(body);
    const updatedProfile = await authService.updateProfile(
      session.user.id,
      validatedData,
    );
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return handleApiError(error);
  }
};
