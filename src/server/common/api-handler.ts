// lib/api-handler.ts
import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiHandler(handler: (req: NextRequest) => Promise<any>) {
  return async (req: NextRequest) => {
    try {
      const data = await handler(req);
      // If handler returns a NextResponse, pass it through
      if (data instanceof NextResponse) return data;
      // Otherwise, assume it's data to wrap
      return NextResponse.json({ success: true, data });
    } catch (error) {
      return handleApiError(error);
    }
  };
}
