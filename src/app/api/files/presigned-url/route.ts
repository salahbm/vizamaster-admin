import { NextRequest } from 'next/server';

import { FileType } from '@/generated/prisma';
import { BadRequestError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { filesService } from '@/server/modules/files/files.service';

export const POST = withHandler(async (request: NextRequest) => {
  const body = await request.json();

  const { fileName, contentType, applicantId, fileType } = body;

  if (!fileName || !contentType || !applicantId || !fileType) {
    throw new BadRequestError('Missing required fields');
  }

  const result = await filesService.getPresignedUploadUrl({
    fileName,
    contentType,
    applicantId,
    fileType: fileType as FileType,
  });

  return result;
});
