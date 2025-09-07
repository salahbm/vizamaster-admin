import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.ComponentProps<'input'>, 'value'> {
  value?: string | number | Date | string[] | undefined;
}

function Input({ className, type, value, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 hover:border-muted-foreground border-input flex h-11 w-full min-w-0 rounded-md border bg-transparent px-4 py-3 font-caption-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:font-body-1',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

// Re-export specialized inputs for convenience
export { PasswordInput } from './password-input';
export { TelephoneInput } from './tel-input';
export { Input };
