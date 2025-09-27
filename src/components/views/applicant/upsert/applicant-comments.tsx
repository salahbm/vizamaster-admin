'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ChatGroup } from '@/components/shared/chat/chat-group';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { useAuthStore } from '@/store/use-auth-store';

interface ApplicantCommentsProps {
  id?: string;
}

export default function ApplicantComments({ id }: ApplicantCommentsProps) {
  const t = useTranslations();
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  // Sample data - this would be replaced with actual data from the API
  const chatData = [
    {
      date: 'September 27, 2025',
      messages: [
        {
          author: 'John Doe',
          time: '03:27 PM',
          content:
            'Applicant has submitted all required documents for visa processing.',
          isSent: false,
        },
        {
          author: user?.name || 'You',
          time: '03:28 PM',
          content:
            'I have reviewed the documents and everything looks good. Will proceed with the next steps.',
          isSent: true,
        },
        {
          author: 'Sarah Smith',
          time: '03:29 PM',
          content:
            'Please make sure to verify the passport expiration date before proceeding.',
          isSent: false,
        },
        {
          author: user?.name || 'You',
          time: '03:30 PM',
          content: 'Good catch! I will double-check that now.',
          isSent: true,
        },
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setNewComment('');
    chatData.push({
      date: new Date().toLocaleDateString(),
      messages: [
        {
          author: user?.name || 'You',
          time: new Date().toLocaleTimeString(),
          content: newComment,
          isSent: true,
        },
      ],
    });
  };

  return (
    <div>
      <div className="card-lg mb-4 flex-1">
        <ul className="h-[calc(100vh-350px)] lg:h-[calc(100vh-600px)]">
          {chatData.map((group, index) => (
            <ChatGroup
              key={index}
              date={group.date}
              messages={group.messages}
            />
          ))}
        </ul>
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder={t('applicant.comments.placeholder')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 resize-none"
        />
        <Button type="submit" size="icon" disabled={!newComment.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
