import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withHandler(handler: (req: NextRequest) => Promise<any>) {
  return async (req: NextRequest) => {
    try {
      const data = await handler(req);
      // If handler returns a NextResponse, pass it through
      if (data instanceof NextResponse) return data;
      // Otherwise, assume it's data to wrap
      return NextResponse.json(data);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
