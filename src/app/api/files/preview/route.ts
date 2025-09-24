import { NextRequest } from 'next/server';

import { BadRequestError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { filesService } from '@/server/modules/files/files.service';

export const GET = withHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get('fileKey');

  if (!fileKey) throw new BadRequestError('fileKey is required');

  const result = await filesService.getSignedUrlForDownload(fileKey);

  return result;
});
