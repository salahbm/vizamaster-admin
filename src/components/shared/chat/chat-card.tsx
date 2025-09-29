import { animated, useSpring } from '@react-spring/web';

import { cn } from '@/lib/utils';

// Import useSpring for defining animations and animated for wrapping components

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
  // Define the spring animation using useSpring hook
  // useSpring creates a spring-physics based animation that interpolates values over time
  // 'from' defines the starting state (invisible, scaled down, offset horizontally)
  // 'to' defines the ending state (fully visible, normal scale, no offset)
  // 'config' customizes the animation's feel (tension for stiffness, friction for damping, duration for total time)
  const springProps = useSpring({
    from: {
      opacity: 0, // Start with zero opacity (invisible)
      transform: isSent
        ? 'scale(0.8) translateX(20px)'
        : 'scale(0.8) translateX(-20px)', // Scale down to 80% and slide in from right (sent) or left (received)
    },
    to: {
      opacity: 1, // Animate to full opacity (visible)
      transform: 'scale(1) translateX(0px)', // Scale up to 100% and move to original position
    },
    config: {
      tension: 220, // Higher tension makes the animation snappier/stiffer
      friction: 20, // Friction slows down the oscillation (prevents too much bouncing)
      duration: 300, // Total animation duration in milliseconds (overrides physics if set, but here it blends with spring config)
    },
  });

  return (
    // Wrap the li element with animated.li to apply the animated styles from springProps
    // animated components take the output of useSpring and apply it as inline styles dynamically
    <animated.li
      style={springProps} // The style prop receives the animated values (opacity and transform interpolate over time)
      className={cn(
        'mb-3 max-w-[85%] rounded-2xl px-4 py-3 shadow-sm lg:max-w-2/5',
        isSent
          ? 'bg-primary/70 text-primary-foreground ml-auto rounded-br-none'
          : 'bg-secondary/10 dark:bg-secondary/55 text-secondary-foreground rounded-bl-none',
      )}
    >
      <div className="border-border/70 mb-2 flex items-center justify-between gap-2 border-b pb-1">
        <span className="text-sm font-bold">{author}</span>
        <span className="font-caption-2">{time}</span>
      </div>
      <article className="font-caption-1 break-words whitespace-pre-wrap">
        {content}
      </article>
    </animated.li>
  );
}
