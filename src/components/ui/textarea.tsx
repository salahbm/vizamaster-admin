import * as React from 'react';

import { cn } from '@/lib/utils';

import { FieldValueTypes } from '@/types/global';

// Create a new interface that extends the HTML textarea attributes
// but modifies the value prop to accept our custom FieldValueTypes type
interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> {
  value?: FieldValueTypes;
}

function Textarea({ className, value, ...props }: TextareaProps) {
  // Convert value to a format acceptable by HTML textarea
  const processedValue: string = React.useMemo(() => {
    if (value === undefined || value === null) {
      return '';
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  }, [value]);

  // Create a new props object without the original value prop
  // to avoid passing it directly to the textarea element
  const { ...textareaProps } = props;

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground hover:border-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-36 w-full rounded border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      value={processedValue}
      {...textareaProps}
    />
  );
}

export { Textarea };
