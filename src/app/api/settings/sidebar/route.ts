import { NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { sidebarService } from '@/server/modules/sidebar/sidebar.service';

// GET /api/settings/sidebar
export async function GET() {
  try {
    // Get all sidebars
    const result = await sidebarService.getAllSidebar();

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
