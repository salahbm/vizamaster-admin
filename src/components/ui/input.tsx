import * as React from 'react';

import { cn } from '@/lib/utils';

import { TFieldValues } from '@/types/global';

interface InputProps extends Omit<React.ComponentProps<'input'>, 'value'> {
  value?: TFieldValues;
}

function Input({ className, type, value, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 hover:border-muted-foreground border-input font-caption-1 md:font-body-1 flex h-11 w-full min-w-0 rounded border bg-transparent px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

// Re-export specialized inputs for convenience
export { PasswordInput } from './password-input';
export { TelephoneInput } from './tel-input';
export { Input };
