import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { parsePaginationAndSortParams } from '@/server/common/utils';
import { sidebarService } from '@/server/modules/sidebar/sidebar.service';

// GET /api/settings/sidebar
export async function GET(request: NextRequest) {
  try {
    // Get all sidebars
    const searchParams = new URL(request.url).searchParams;

    const { sort } = parsePaginationAndSortParams(searchParams);

    const result = await sidebarService.getAllSidebar(sort);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
