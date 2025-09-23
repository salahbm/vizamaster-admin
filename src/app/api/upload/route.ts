import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { filesService } from '@/server/modules/files/files.service';

export const POST = withHandler(async (request: NextRequest) => {
  const { key, contentType } = await request.json();

  try {
    const signedUrl = await filesService.getSignedUrlForUpload(
      key,
      contentType,
    );
    return NextResponse.json({ signedUrl });
  } catch (error) {
    return handleApiError(error);
  }
});
