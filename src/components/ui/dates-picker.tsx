'use client';

import * as React from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TFieldValues } from '@/types/global';

export interface DatePickerProps {
  /** The currently selected date */
  value?: TFieldValues;
  /** Callback function when date is selected */
  onValueChange?: (date: Date | undefined | string | string[]) => void;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Disable the date picker */
  disabled?: boolean;
  /** Custom CSS class for the trigger button */
  className?: string;
  /** Format for displaying the selected date */
  dateFormat?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Show the calendar in dropdown mode */
  dropdownCalendar?: boolean;
  /** Error state for form validation */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onValueChange,
  placeholder = 'placeholder.date',
  disabled = false,
  className,
  dateFormat = 'PPP',
  minDate = new Date('1900-01-01'),
  maxDate = new Date('2100-12-31'),
  dropdownCalendar = true,
  error = false,
  errorMessage,
}) => {
  const t = useTranslations('Common');
  return (
    <div className="flex flex-col gap-1">
      <Popover>
        <PopoverTrigger
          className={cn(
            'cursor-pointer selection:bg-primary selection:text-primary-foreground dark:bg-input/30 hover:border-muted-foreground border-input flex h-11 w-full min-w-0 rounded-md border bg-transparent px-4 py-3 font-caption-1 shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:font-body-1 justify-between',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            !value && 'text-muted-foreground',
            error && 'border-destructive',
            className
          )}
          disabled={disabled}
        >
          {value ? format(value as Date, dateFormat) : <span>{t(`${placeholder}`)}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value as Date}
            onSelect={onValueChange}
            disabled={date =>
              date > (maxDate || new Date()) || date < (minDate || new Date('1900-01-01'))
            }
            captionLayout={dropdownCalendar ? 'dropdown' : 'label'}
          />
        </PopoverContent>
      </Popover>
      {error && errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </div>
  );
};

export default DatePicker;
