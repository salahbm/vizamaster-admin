'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ChatGroup } from '@/components/shared/chat/chat-group';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { useCreateComment, useInfiniteComments } from '@/hooks/comment';
import { useAlert } from '@/providers/alert';
import { useAuthStore } from '@/store/use-auth-store';

interface ApplicantCommentsProps {
  id?: string;
}

export default function ApplicantComments({ id }: ApplicantCommentsProps) {
  const t = useTranslations();
  const alert = useAlert();
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const scrollRef = useRef<HTMLUListElement>(null);

  // Fetch comments using the infinite query hook
  const {
    data,
    isLoading: isCommentsLoading,
    isFetching: isCommentsFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteComments(id || '', 1);

  // Create comment mutation
  const { mutateAsync: createComment, isPending: isCreatingComment } =
    useCreateComment();

  // Extract all comments from the paginated data
  const allComments = useMemo(() => {
    if (!data?.pages) return [];

    // The data structure is an array of arrays of comments
    return data.pages.flatMap((page) => {
      // Each page is an array of comments
      return Array.isArray(page) ? page : [];
    });
  }, [data?.pages]);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (
      scrollRef.current &&
      !isCommentsLoading &&
      !isCommentsFetching &&
      !isFetchingNextPage
    ) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allComments, isCommentsLoading, isCommentsFetching, isFetchingNextPage]);

  // Load more comments
  const loadMoreComments = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Create a new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !id || !user) return;

    try {
      await createComment({
        content: newComment,
        applicantId: id,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
      alert({
        title: t('Common.messages.error'),
        description:
          t('applicant.comments.createError') || 'Failed to create comment',
        icon: 'error',
      });
    }
  };

  // Group comments by date
  const groupedComments = useMemo(() => {
    if (!allComments.length) return [];

    const sortedComments = [...allComments].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const groups: Record<string, any[]> = {};

    sortedComments.forEach((comment) => {
      const date = format(new Date(comment.createdAt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push({
        author: comment.author.name,
        time: format(new Date(comment.createdAt), 'HH:mm'),
        content: comment.content,
        isSent: comment.authorId === user?.id,
      });
    });

    return Object.entries(groups).map(([date, messages]) => ({
      date: format(new Date(date), 'MMMM d, yyyy'),
      messages,
    }));
  }, [allComments, user?.id]);

  return (
    <div>
      <div className="card-lg mb-4 flex-1">
        <ul
          ref={scrollRef}
          className="h-[calc(100vh-350px)] overflow-y-auto lg:h-[calc(100vh-600px)]"
          onScroll={(e) => {
            const target = e.currentTarget;
            if (target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
              loadMoreComments();
            }
          }}
        >
          {isCommentsLoading && !allComments.length ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                {t('applicant.comments.loading')}
              </p>
            </div>
          ) : allComments.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                {t('applicant.comments.noComments')}
              </p>
            </div>
          ) : (
            <>
              {isFetchingNextPage && (
                <div className="text-muted-foreground py-2 text-center text-sm">
                  {t('applicant.comments.loading')}
                </div>
              )}
              {groupedComments.map((group, index) => (
                <ChatGroup
                  key={index}
                  date={group.date}
                  messages={group.messages}
                />
              ))}
            </>
          )}
        </ul>
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder={t('applicant.comments.placeholder')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 resize-none"
          disabled={isCreatingComment}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newComment.trim() || isCreatingComment}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
