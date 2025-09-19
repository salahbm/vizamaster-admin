import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { codesService } from '@/server/modules/codes/codes.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await codesService.getCodeById(id);
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

    const result = await codesService.updateCodeById(id, body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await codesService.deleteCodeById(id);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
