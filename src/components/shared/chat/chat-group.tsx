import { ChatCard } from './chat-card';

export function ChatGroup({
  date,
  messages,
}: {
  date: string;
  messages: {
    author: string;
    time: string;
    content: string;
    isSent: boolean;
  }[];
}) {
  return (
    <li className="my-6">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border/30 w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="font-caption-1 bg-background text-accent-foreground px-3">
            {date}
          </span>
        </div>
      </div>
      <ul className="space-y-1">
        {messages.map((msg, index) => (
          <ChatCard
            key={index}
            author={msg.author}
            time={msg.time}
            content={msg.content}
            isSent={msg.isSent}
          />
        ))}
      </ul>
    </li>
  );
}
