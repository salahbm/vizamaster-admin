/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';

type RouteContext = {
  params?: Record<string, string>;
};

export function withHandler(
  handler: (req: NextRequest, context: RouteContext) => Promise<any>,
) {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      const data = await handler(req, context);
      if (data instanceof NextResponse) return data;
      return NextResponse.json(data);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
