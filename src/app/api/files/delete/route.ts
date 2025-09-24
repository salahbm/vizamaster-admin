import { NextRequest } from 'next/server';

import { BadRequestError } from '@/server/common/errors';
import { withHandler } from '@/server/common/interceptors/handle.interceptor';
import { filesService } from '@/server/modules/files/files.service';

export const DELETE = withHandler(async (request: NextRequest) => {
  const searchParams = new URL(request.url).searchParams;

  let idsArray: string[] = [];

  const ids = searchParams.get('ids') || '';

  if (!Array.isArray(ids)) idsArray = [ids];

  idsArray = ids.split(',');

  if (!idsArray?.length) throw new BadRequestError('Ids are required');

  const result = await filesService.deleteFileFromR2(idsArray);

  return result;
});
