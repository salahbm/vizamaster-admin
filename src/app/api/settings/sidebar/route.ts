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
    console.error('Error creating sidebar:', error);
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
      href: body.href,
      order: Number(body.order),
      icon: body.icon || null,
      parentId: body.parentId || null,
    };

    const result = await sidebarService.createSidebar(transformedBody);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error creating sidebar:', error);
    return handleApiError(error);
  }
}
