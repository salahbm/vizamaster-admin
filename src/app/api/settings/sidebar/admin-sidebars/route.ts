import { NextRequest, NextResponse } from 'next/server';

import { BadRequestError, handleApiError } from '@/server/common/errors';
import { sidebarService } from '@/server/modules/sidebar/sidebar.service';

// GET /api/settings/sidebar
export async function GET(request: NextRequest) {
  try {
    // Get all sidebars
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      throw new BadRequestError('User id is required');
    }

    const result = await sidebarService.getUserSidebars(userId);

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

export async function PATCH(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const userId = searchParams.get('userId');

  if (!userId) throw new BadRequestError('User id is required');

  const body = await req.json();

  if (!body.sidebarIds || !Array.isArray(body.sidebarIds)) {
    throw new BadRequestError('Invalid sidebar IDs');
  }

  const updatedAdmin = await sidebarService.updateAdminSidebars(
    userId,
    body.sidebarIds,
  );

  return NextResponse.json(updatedAdmin);
}
