import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { sidebarService } from '@/server/modules/sidebar/sidebar.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await sidebarService.getSidebarById(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const result = await sidebarService.updateSidebarById(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Invalid or empty request body' },
        { status: 400 },
      );
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await sidebarService.deleteSidebarById(id);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
