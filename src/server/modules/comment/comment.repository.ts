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

  async createComment(data: {
    content: string;
    applicantId: string;
    authorId: string;
  }) {
    return this.prisma.comment.create({
      data,
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
  }

  async createAlertsForComment(commentId: string, authorId: string) {
    // Get all active users except the comment author
    const users = await this.prisma.users.findMany({
      where: {
        id: { not: authorId },
        active: true,
      },
      select: { id: true },
    });

    // Create alerts for each user
    if (users.length > 0) {
      return this.prisma.alert.createMany({
        data: users.map((user) => ({
          commentId,
          userId: user.id,
          isRead: false,
        })),
      });
    }

    return { count: 0 };
  }
}

export const commentRepository = new CommentRepository();
