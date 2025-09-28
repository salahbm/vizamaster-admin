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

      // 2. Update applicant + get its creator
      const applicant = await tx.applicant.update({
        where: { id: data.applicantId },
        data: { isAlert: true }, // make sure field matches schema
        select: { id: true, createdBy: true }, // createdBy is applicant author's email address
      });

      // 3. find the author from users table
      const author = await tx.users.findUnique({
        where: { id: data.authorId },
        select: { id: true, email: true },
      });

      // 4. Find the user ID for the applicant creator
      if (applicant.createdBy !== author?.email) {
        // Find the user by email to get their ID
        const creatorUser = await tx.users.findUnique({
          where: { email: applicant.createdBy },
          select: { id: true },
        });

        // Only create alert if we found the user
        if (creatorUser) {
          // Create alert with proper relations
          await tx.alert.create({
            data: {
              userId: creatorUser.id,
              isRead: false,
              commentId: comment.id,
            },
          });
        }
      }

      return comment;
    });
  }
}
export const commentRepository = new CommentRepository();
