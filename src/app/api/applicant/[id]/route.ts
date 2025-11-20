import { NextRequest, NextResponse } from 'next/server';

import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { authGuard } from '@/server/common/guard/auth.guard';
import { applicantService } from '@/server/modules/applicant';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    // Check authentication
    await authGuard.requireAuth();

    const { id } = await params;
    if (!id) throw new UnauthorizedError('Unauthorized');

    const applicant = await applicantService.getApplicantById(id);
    return NextResponse.json(applicant);
  } catch (error) {
    return handleApiError(error);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    // Check authentication
    await authGuard.requireAuth();

    const { id } = await params;
    if (!id) throw new UnauthorizedError('Unauthorized');

    const body = await req.json();
    const applicant = await applicantService.updateApplicant(id, body);
    return NextResponse.json(applicant);
  } catch (error) {
    return handleApiError(error);
  }
};
