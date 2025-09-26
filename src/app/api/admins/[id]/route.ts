import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { AuthService } from '@/server/modules/auth/auth.service';

const authService = new AuthService();

// PATCH /api/admins/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updatedUser = await authService.updateUser(id, body);

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admins/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const deletedUser = await authService.deleteUser(id);
    return NextResponse.json(deletedUser);
  } catch (error) {
    return handleApiError(error);
  }
}
