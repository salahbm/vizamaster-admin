/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/server/common/errors';

type Handler<T = any> = (req: NextRequest) => Promise<T>;
type Middleware<T = any> = (next: Handler<T>) => Handler<T>;

export function withHandler<T>(
  handler: Handler<T>,
  ...middlewares: Middleware<T>[]
) {
  // compose middlewares (right to left)
  const composed = middlewares.reduceRight((next, mw) => mw(next), handler);

  return async (req: NextRequest) => {
    console.time('Request');
    try {
      const data = await composed(req);

      console.timeEnd('Request');
      if (data instanceof NextResponse) return data;
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.timeEnd('Request');
      return handleApiError(error);
    }
  };
}
