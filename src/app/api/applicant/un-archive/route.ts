import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { applicantService } from '@/server/modules/applicant';

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;

    const ids = searchParams.get('ids') || '';

    const idsArray = ids.split(',');

    const result = await applicantService.unarchiveApplicants(idsArray);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
