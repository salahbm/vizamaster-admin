import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { parsePaginationAndSortParams } from '@/server/common/utils';
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

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = new URL(request.url).searchParams;

    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || undefined;
    const partner = searchParams.get('partner') || undefined;
    const isArchived = searchParams.get('isArchived') === 'true';

    const { page, size, sort } = parsePaginationAndSortParams(searchParams);

    // Get users
    const result = await applicantService.getAllApplicants(
      page,
      size,
      sort,
      search,
      country,
      partner,
      isArchived,
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
