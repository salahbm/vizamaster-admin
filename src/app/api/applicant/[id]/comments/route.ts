import { NextRequest, NextResponse } from 'next/server';

import {
  BadRequestError,
  UnauthorizedError,
  handleApiError,
} from '@/server/common/errors';
import { AuthGuard } from '@/server/common/guard/auth.guard';
import { commentService } from '@/server/modules/comment/comment.service';

// Get comments for an applicant with pagination
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authGuard = new AuthGuard();
  const session = await authGuard.checkSession();

  if (!session) throw new UnauthorizedError('Unauthorized');

  try {
    // Get query parameters for pagination
    const { id } = await params;
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const cursor = url.searchParams.get('cursor') || undefined;

    // Get comments using the service
    const result = await commentService.getCommentsByApplicantId(
      id,
      limit,
      cursor,
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// Create a new comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authGuard = new AuthGuard();
  const session = await authGuard.checkSession();

  if (!session) throw new UnauthorizedError('Unauthorized');

  try {
    const body = await req.json();
    const { id } = await params;

    if (!body.content || typeof body.content !== 'string') {
      throw new BadRequestError('Comment content is required');
    }

    // Create the comment using the service
    const result = await commentService.createComment({
      content: body.content,
      applicantId: id,
      authorId: session.user.id,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
