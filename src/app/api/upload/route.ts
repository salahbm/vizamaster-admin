import { NextRequest } from 'next/server';

import { FileType } from '@/generated/prisma';
import { BadRequestError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { filesService } from '@/server/modules/files/files.service';

export const POST = withHandler(async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) throw new BadRequestError('File is required');

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = formData.get('fileName') as string;
  const contentType = formData.get('contentType') as string;
  const applicantId = formData.get('applicantId') as string;
  const fileType = formData.get('fileType') as FileType;

  if (!fileName || !contentType || !applicantId || !fileType) {
    throw new BadRequestError('Missing required fields');
  }

  const result = await filesService.getSignedUrlForUpload({
    fileName,
    contentType,
    applicantId,
    fileType,
    buffer,
  });

  return result;
});
