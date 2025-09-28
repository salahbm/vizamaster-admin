'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ChatGroup } from '@/components/shared/chat/chat-group';
import { Empty } from '@/components/shared/icons';
import { ChatSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import LotteLoading from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';

import { useCreateComment, useInfiniteComments } from '@/hooks/comment';
import { useAlert } from '@/providers/alert';
import { useAuthStore } from '@/store/use-auth-store';

export default function ApplicantComments({ id }: { id?: string }) {
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
  } = useInfiniteComments(id!, 10);

  // Create comment mutation
  const { mutateAsync: createComment, isPending: isCreatingComment } =
    useCreateComment();

  // Extract all comments from the paginated data
  const allComments = useMemo(() => {
    if (!data?.pages) return [];

    // Each page contains a data array with comments
    return data.pages.flatMap((page) => {
      return page.data || [];
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
        description: t('applicant.comments.createError'),
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

    // Define the correct type for the chat messages
    type ChatMessage = {
      author: string;
      time: string;
      content: string;
      isSent: boolean;
    };

    const groups: Record<string, ChatMessage[]> = {};

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
    <div className="flex h-full flex-col">
      <div className="card flex-1 lg:mb-4">
        <ul
          ref={scrollRef}
          className="no-scrollbar h-[calc(100vh-400px)] overflow-y-auto lg:h-[calc(100vh-500px)]"
          onScroll={(e) => {
            const target = e.currentTarget;
            if (target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
              loadMoreComments();
            }
          }}
        >
          {isCommentsLoading && !allComments.length ? (
            <ChatSkeleton messageCount={5} />
          ) : allComments.length === 0 ? (
            <li className="flex h-full items-center justify-center">
              <p className="text-muted-foreground flex items-center">
                <Empty className="mr-2 h-4 w-4" />
                {t('applicant.comments.noComments')}
              </p>
            </li>
          ) : (
            <>
              {isFetchingNextPage && (
                <li className="flex-center">
                  <LotteLoading />
                </li>
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
          maxLength={500}
          required
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
