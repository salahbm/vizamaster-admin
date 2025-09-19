import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { parsePaginationAndSortParams } from '@/server/common/utils';
import { codesService } from '@/server/modules/codes';

// GET /api/settings/group-codes
export async function GET(request: NextRequest) {
  try {
    // Get all sidebars
    const searchParams = new URL(request.url).searchParams;

    const search = searchParams.get('search');
    const groupCodeId = searchParams.get('groupCodeId');

    const { sort, page, size } = parsePaginationAndSortParams(searchParams);

    const result = await codesService.getAllCodes(
      page,
      size,
      sort,
      search ?? undefined,
      groupCodeId ?? undefined,
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
      groupCodeId: body.groupCodeId,
    };

    const result = await codesService.createCode(transformedBody);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
