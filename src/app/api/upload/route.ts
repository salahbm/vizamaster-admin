import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { FileType } from '@/generated/prisma';
import { handleApiError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { filesService } from '@/server/modules/files/files.service';

const uploadRequestSchema = z.object({
  key: z.string(),
  contentType: z.string(),
  applicantId: z.string(),
  fileType: z.enum([
    FileType.PASSPORT,
    FileType.VISA,
    FileType.CV,
    FileType.INSURANCE,
    FileType.FLIGHT_DOCUMENT,
    FileType.OTHER,
  ]),
});

export const POST = withHandler(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validatedBody = uploadRequestSchema.parse(body);

    const result = await filesService.getSignedUrlForUpload(validatedBody);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
});
