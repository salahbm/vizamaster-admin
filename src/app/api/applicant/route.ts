import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { applicantService } from '@/server/modules/applicant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await applicantService.createApplicant(body);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
