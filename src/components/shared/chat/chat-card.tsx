import { cn } from '@/lib/utils';

export function ChatCard({
  author,
  time,
  content,
  isSent,
}: {
  author: string;
  time: string;
  content: string;
  isSent: boolean;
}) {
  return (
    <li
      className={cn(
        'mb-3 max-w-[80%] rounded-lg p-3 shadow-sm lg:max-w-2/5',
        isSent
          ? 'bg-primary/70 text-primary-foreground ml-auto'
          : 'bg-secondary/10 text-secondary-foreground',
      )}
    >
      <div className="border-border/70 mb-2 flex items-center justify-between gap-2 border-b pb-1">
        <span className="text-sm font-bold">{author}</span>
        <span className="font-caption-2">{time}</span>
      </div>
      <article className="font-caption-1 break-words whitespace-pre-wrap">
        {content}
      </article>
    </li>
  );
}
