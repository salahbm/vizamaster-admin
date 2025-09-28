import { handlePrismaError } from '@/server/common/errors';
import { createInfinityResponse, createResponse } from '@/server/common/utils';

import { commentRepository } from './comment.repository';

export class CommentService {
  constructor(private readonly repository = commentRepository) {}

  async getCommentsByApplicantId(
    applicantId: string,
    limit: number = 10,
    cursor?: string,
  ) {
    try {
      const result = await this.repository.getCommentsByApplicantId(
        applicantId,
        limit,
        cursor,
      );

      return createInfinityResponse(
        result.comments,
        result.nextCursor,
        result.hasMore,
      );
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async createComment(data: {
    content: string;
    applicantId: string;
    authorId: string;
  }) {
    try {
      // Start a transaction
      const comment = await this.repository.createCommentWithAlerts(data);

      return createResponse(comment);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export const commentService = new CommentService();
