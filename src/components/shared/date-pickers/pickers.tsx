import * as React from 'react';
import { useState } from 'react';

import { CalendarIcon, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FieldError } from 'react-hook-form';

import { MonthPicker } from '@/components/shared/date-pickers/month-picker';
import { TimeInput } from '@/components/shared/date-pickers/time-input';
import {
  formatDateValue,
  getSelectedRange,
  getTimeFromDate,
  handleDateTimeChange,
  handleRangeSelection,
  isDateDisabled,
  useDateLocale,
} from '@/components/shared/date-pickers/utils';
import { YearPicker } from '@/components/shared/date-pickers/year-picker';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import { TFieldValues } from '@/types/global';

export interface DatePickerProps {
  /** The currently selected date */
  value?: TFieldValues;
  /** Callback function when date is selected */
  onChange?: (
    date: Date | undefined | string | string[] | { from: Date; to?: Date },
  ) => void;
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
  error?: FieldError;
  /** Error message to display */
  errorMessage?: string;
  /** Variant of the date picker */
  variant?: 'default' | 'date-time' | 'time' | 'range' | 'month' | 'year';
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'placeholder.date',
  disabled = false,
  className,
  dateFormat = 'PPP',
  minDate = new Date('1900-01-01'),
  maxDate = new Date('2100-12-31'),
  dropdownCalendar = true,
  error,
  variant = 'default',
}) => {
  const t = useTranslations('Common');
  const [selectedTime, setSelectedTime] = useState<string>('12:00');

  // Handle combined date and time changes
  const handleDateChange = (newDate: Date | undefined) => {
    handleDateTimeChange(newDate, selectedTime, variant, onChange);
  };

  // Update time when time input changes
  const prevSelectedTimeRef = React.useRef(selectedTime);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    // Only update if selectedTime changed but value didn't change
    // This prevents infinite loops when value changes due to onValueChange
    if (
      value &&
      onChange &&
      selectedTime &&
      selectedTime !== prevSelectedTimeRef.current &&
      value === prevValueRef.current
    ) {
      const newDate = new Date(value as Date);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      newDate.setHours(hours || 0, minutes || 0);
      onChange(newDate);
    }

    // Update refs
    prevSelectedTimeRef.current = selectedTime;
    prevValueRef.current = value;
  }, [selectedTime, value, onChange]);

  // Get locale for date formatting
  const dateLocale = useDateLocale();

  // Format the display value based on variant
  const getDisplayValue = React.useCallback(() => {
    return formatDateValue(
      value,
      variant,
      dateFormat,
      placeholder,
      t,
      dateLocale,
    );
  }, [value, variant, dateFormat, placeholder, t, dateLocale]);

  // Initialize date with current time when in time-related variants
  React.useEffect(() => {
    if (
      (variant === 'time' || variant === 'date-time') &&
      value instanceof Date
    ) {
      setSelectedTime(getTimeFromDate(value));
    }
  }, [variant, value]);

  // Render the appropriate picker content based on variant
  const renderPickerContent = () => {
    switch (variant) {
      case 'date-time':
        return (
          <div className="min-w-[320px] p-3">
            <Tabs defaultValue="date">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="date">{t('date')}</TabsTrigger>
                <TabsTrigger value="time">{t('time')}</TabsTrigger>
              </TabsList>
              <TabsContent value="date" className="mt-2">
                <Calendar
                  mode="single"
                  selected={value as Date}
                  onSelect={handleDateChange}
                  disabled={(date) => isDateDisabled(date, minDate, maxDate)}
                  captionLayout={dropdownCalendar ? 'dropdown' : 'label'}
                />
              </TabsContent>
              <TabsContent value="time" className="mt-2">
                <TimeInput
                  value={selectedTime}
                  onChange={setSelectedTime}
                  className="w-full text-center text-lg font-medium"
                />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'time':
        return (
          <div className="min-w-[280px] p-3">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-start">
                <div className="flex items-center space-x-2">
                  <Clock className="text-muted-foreground h-5 w-5" />
                  <span className="text-sm font-medium">
                    {t('placeholder.time')}
                  </span>
                </div>
              </div>
              <TimeInput
                value={selectedTime}
                onChange={setSelectedTime}
                className="w-full text-center text-lg font-medium"
              />
            </div>
          </div>
        );
      case 'month':
        return (
          <MonthPicker
            value={value as Date}
            onValueChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        );
      case 'year':
        return (
          <YearPicker
            value={value as Date}
            onValueChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        );
      case 'range':
        return (
          <Calendar
            mode="range"
            selected={getSelectedRange(value)}
            onSelect={(range) => handleRangeSelection(range, onChange)}
            disabled={(date) =>
              date > (maxDate || new Date()) ||
              date < (minDate || new Date('1900-01-01'))
            }
            captionLayout={dropdownCalendar ? 'dropdown' : 'label'}
            numberOfMonths={2}
          />
        );
      default:
        return (
          <Calendar
            mode="single"
            selected={value as Date}
            onSelect={onChange}
            disabled={(date) =>
              date > (maxDate || new Date()) ||
              date < (minDate || new Date('1900-01-01'))
            }
            captionLayout={dropdownCalendar ? 'dropdown' : 'label'}
          />
        );
    }
  };

  // Get the appropriate icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'time':
        return <Clock className="ml-auto h-4 w-4 opacity-50" />;
      default:
        return (
          <CalendarIcon className="text-muted-foreground ml-auto h-4 w-4 opacity-50" />
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'selection:bg-primary selection:text-primary-foreground dark:bg-input/30 hover:border-muted-foreground border-input font-caption-1 md:font-body-1 flex h-11 w-full min-w-0 cursor-pointer justify-between rounded border bg-transparent px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          !value && 'text-muted-foreground',
          error && 'border-destructive',
          className,
        )}
        disabled={disabled}
      >
        {getDisplayValue()}
        {getIcon()}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
        {renderPickerContent()}
      </PopoverContent>
    </Popover>
  );
};
