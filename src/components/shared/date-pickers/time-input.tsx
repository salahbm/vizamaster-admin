import * as React from 'react';

import { cn } from '@/lib/utils';

interface TimeInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange' | 'value'
  > {
  value?: string; // "HH:mm"
  onChange?: (value: string) => void;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const handleTimeButtonClick = (time: string) => {
      onChange?.(time);
    };

    return (
      <div>
        <input
          type="time"
          value={value}
          onChange={handleChange}
          step={60} // 1 minute increments
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:ring-ring font-caption-1 w-full rounded border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            '08:00',
            '09:00',
            '10:00',
            '12:00',
            '14:00',
            '16:00',
            '18:00',
            '20:00',
            '22:00',
          ].map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleTimeButtonClick(time)}
              className={cn(
                'cursor-pointer rounded p-2 text-sm font-medium',
                value === time
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

TimeInput.displayName = 'TimeInput';

export { TimeInput };
