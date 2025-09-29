import { NotFoundError } from '@/server/common/errors';
import prisma from '@/server/db/prisma';

export class CommentRepository {
  private readonly prisma = prisma;

  async getCommentsByApplicantId(
    applicantId: string,
    limit: number = 10,
    cursor?: string,
  ) {
    // Find comments with pagination using cursor
    const comments = await this.prisma.comment.findMany({
      where: { applicantId },
      take: limit,
      skip: cursor ? 1 : 0, // Skip the cursor if provided
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get the last item in the array to use as next cursor
    const lastComment = comments[comments.length - 1];
    const nextCursor = lastComment?.id;

    // Check if there are more comments
    const remainingCount =
      cursor && lastComment
        ? await this.prisma.comment.count({
            where: {
              applicantId,
              createdAt: {
                lt: lastComment.createdAt,
              },
            },
          })
        : await this.prisma.comment.count({
            where: {
              applicantId,
              id: {
                notIn: comments.map((comment) => comment.id),
              },
            },
          });

    return {
      comments,
      nextCursor,
      hasMore: remainingCount > 0,
    };
  }

  async createCommentWithAlerts(data: {
    content: string;
    applicantId: string;
    authorId: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create comment
      const comment = await tx.comment.create({
        data,
        include: { author: { select: { id: true, name: true } } },
      });

      // 2. Get applicant and its creator's user account
      const applicant = await tx.applicant.update({
        where: { id: data.applicantId },
        data: { isAlert: true },
        select: { id: true, createdBy: true },
      });

      if (!applicant) throw new NotFoundError('Applicant not found');

      // 3. Find the user account for the applicant creator
      const creatorUser = await tx.users.findUnique({
        where: { email: applicant.createdBy },
        select: { id: true },
      });

      // 4. Collect alert recipients (other commentators)
      const commentators = await tx.comment.findMany({
        where: {
          applicantId: data.applicantId,
          authorId: { not: data.authorId },
        },
        select: { authorId: true },
        distinct: ['authorId'],
      });

      // Start with commentator IDs
      const recipients = new Set(commentators.map((c) => c.authorId));

      // Add creator's user ID if they exist and aren't the current author
      if (creatorUser && creatorUser.id !== data.authorId) {
        recipients.add(creatorUser.id);
      }

      // 5. Create alerts
      if (recipients.size > 0) {
        await tx.alert.createMany({
          data: Array.from(recipients).map((userId) => ({
            userId,
            isRead: false,
            commentId: comment.id,
            applicantId: applicant.id,
          })),
        });
      }

      return comment;
    });
  }
}
export const commentRepository = new CommentRepository();
