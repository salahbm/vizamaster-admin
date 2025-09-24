/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';

export function withHandler<T>(
  handler: (req: NextRequest, context: T) => Promise<any>,
) {
  return async (req: NextRequest, context: T) => {
    try {
      const data = await handler(req, context);
      if (data instanceof NextResponse) return data;
      return NextResponse.json(data);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
