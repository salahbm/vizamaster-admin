import { NextRequest, NextResponse } from 'next/server';

import { getTranslations } from 'next-intl/server';

import { AuthService } from '@/server/modules/auth/auth.service';

const authService = new AuthService();

export async function PATCH(
  request: NextRequest,
  context: Promise<{ params: Promise<{ id: string }> }>,
) {
  // Get the ID parameter
  const { params } = await context;
  const { id } = await params;
  try {
    // Check authentication and authorization
    await authService.checkAuth(request);

    // Get request body
    const body = await request.json();

    // Update user
    const updatedUser = await authService.updateUser(id, body);

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    const t = await getTranslations();

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || t('errors.somethingWentWrong') },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: t('errors.somethingWentWrong') },
      { status: 500 },
    );
  }
}

// DELETE /api/admins/[id]
export async function DELETE(
  request: NextRequest,
  context: Promise<{ params: Promise<{ id: string }> }>,
) {
  // Get the ID parameter
  const { params } = await context;
  const { id } = await params;
  try {
    // Check authentication and authorization
    await authService.checkAuth(request);

    // Delete the user
    const deletedUser = await authService.deleteUser(id);

    return NextResponse.json(deletedUser);
  } catch (error: unknown) {
    const t = await getTranslations();

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || t('errors.somethingWentWrong') },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: t('errors.somethingWentWrong') },
      { status: 500 },
    );
  }
}
