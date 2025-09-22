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
  const { id } = await params;
  if (!id) throw new UnauthorizedError('Unauthorized');
  try {
    const body = await req.json();
    const applicant = await applicantService.updateApplicant(id, body);
    return NextResponse.json(applicant);
  } catch (error) {
    return handleApiError(error);
  }
};
