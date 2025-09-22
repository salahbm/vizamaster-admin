import { NextRequest, NextResponse } from 'next/server';

import { UnauthorizedError, handleApiError } from '@/server/common/errors';
import { applicantService } from '@/server/modules/applicant';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  if (!id) throw new UnauthorizedError('Unauthorized');
  try {
    const visa = await applicantService.getApplicantVisa(id);
    return NextResponse.json(visa);
  } catch (error) {
    return handleApiError(error);
  }
};
