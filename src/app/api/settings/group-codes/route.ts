import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { parsePaginationAndSortParams } from '@/server/common/utils';
import { groupCodesService } from '@/server/modules/group-codes';

// GET /api/settings/group-codes
export async function GET(request: NextRequest) {
  try {
    // Get all sidebars
    const searchParams = new URL(request.url).searchParams;

    const search = searchParams.get('search') as string;
    const code = searchParams.get('code') as string;

    const { sort, page, size } = parsePaginationAndSortParams(searchParams);

    const result = await groupCodesService.getAllGroupCodes(
      page,
      size,
      sort,
      search,
      code,
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transform and validate data according to Prisma schema
    const transformedBody = {
      labelEn: body.labelEn,
      labelRu: body.labelRu,
      code: body.code,
    };

    const result = await groupCodesService.createGroupCode(transformedBody);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
