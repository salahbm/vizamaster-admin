import { NextRequest } from 'next/server';

import { FileType } from '@/generated/prisma';
import { BadRequestError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { filesService } from '@/server/modules/files/files.service';

export const GET = withHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get('fileKey');
  const applicantId = searchParams.get('applicantId');
  const fileType = searchParams.get('fileType');

  if (!fileKey || !applicantId || !fileType)
    throw new BadRequestError(
      'fileKey, applicantId, and fileType are required',
    );

  const result = await filesService.getSignedUrlForDownload({
    fileKey,
    applicantId,
    fileType: fileType as FileType,
  });

  return result;
});
