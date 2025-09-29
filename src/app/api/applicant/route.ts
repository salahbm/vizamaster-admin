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
    const status = searchParams.get('status') || undefined;
    const jobTitle = searchParams.get('jobTitle') || undefined;
    const userId = searchParams.get('userId') || undefined;

    // Only set isAlert if it's explicitly provided in the query
    // This way, if it's undefined, it won't filter by isAlert at all
    const isAlertParam = searchParams.get('isAlert');
    const isAlert =
      isAlertParam === 'true'
        ? true
        : isAlertParam === 'false'
          ? false
          : undefined;

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
      isAlert,
      status,
      jobTitle,
      userId,
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;

    const ids = searchParams.get('ids') || '';

    const idsArray = ids.split(',');

    const result = await applicantService.deleteApplicants(idsArray);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
