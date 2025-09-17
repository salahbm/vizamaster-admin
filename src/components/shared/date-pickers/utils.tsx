import React from 'react';

import { Locale, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useLocale } from 'next-intl';

import { FieldValueTypes } from '@/types/global';

// Custom hook to get date locale
export const useDateLocale = () => {
  const locale = useLocale();
  return locale === 'ru' ? ru : undefined;
};

/**
 * Format a date or range value based on the variant
 */
export const formatDateValue = (
  value: FieldValueTypes | undefined,
  variant: 'default' | 'date-time' | 'time' | 'range' | 'month' | 'year',
  dateFormat: string,
  placeholder: string,
  t: (key: string) => string,
  dateLocale?: Locale,
): string | React.ReactNode => {
  if (!value) return <span>{t(`${placeholder}`)}</span>;

  // Handle range variant separately
  if (variant === 'range') {
    // Check if value is a range object
    if (typeof value === 'object' && 'from' in value) {
      const rangeValue = value as { from?: Date; to?: Date };
      if (rangeValue.from && rangeValue.to) {
        return `${format(rangeValue.from, dateFormat, { locale: dateLocale })} - ${format(rangeValue.to, dateFormat, { locale: dateLocale })}`;
      } else if (rangeValue.from) {
        return `${format(rangeValue.from, dateFormat, { locale: dateLocale })} - ...`;
      } else if (rangeValue.to) {
        return `... - ${format(rangeValue.to, dateFormat, { locale: dateLocale })}`;
      }
    }
    return <span>{t(`${placeholder}`)}</span>;
  }

  const dateObj = value as Date;

  switch (variant) {
    case 'date-time':
      return format(dateObj, `${dateFormat} HH:mm`, { locale: dateLocale });
    case 'time':
      return format(dateObj, 'HH:mm', { locale: dateLocale });
    case 'month':
      return format(dateObj, 'MMMM yyyy', { locale: dateLocale });
    case 'year':
      return format(dateObj, 'yyyy', { locale: dateLocale });
    default:
      return format(dateObj, dateFormat, { locale: dateLocale });
  }
};

/**
 * Handle date and time changes for date-time variant
 */
export const handleDateTimeChange = (
  newDate: Date | undefined,
  selectedTime: string,
  variant: string,
  onValueChange?: (
    date: Date | undefined | string | string[] | { from: Date; to?: Date },
  ) => void,
): void => {
  if (!newDate || !onValueChange) return;

  if (variant === 'date-time' && selectedTime) {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    newDate.setHours(hours || 0, minutes || 0);
  }

  onValueChange(newDate);
};

/**
 * Extract time from a date object as a formatted string
 */
export const getTimeFromDate = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

/**
 * Handle range selection from calendar
 */
export const handleRangeSelection = (
  range: { from?: Date; to?: Date } | undefined,
  onValueChange?: (
    date: Date | undefined | string | string[] | { from: Date; to?: Date },
  ) => void,
): void => {
  if (!range || !onValueChange) return;

  // Only update if we have valid dates
  if (range.from || range.to) {
    onValueChange({
      from: range.from as Date,
      to: range.to,
    });
  } else {
    // If both dates are cleared, reset the value
    onValueChange(undefined);
  }
};

/**
 * Get selected range for calendar
 */
export const getSelectedRange = (value: FieldValueTypes | undefined) => {
  return {
    from:
      value && typeof value === 'object' && 'from' in value
        ? (value.from as Date)
        : (value as Date),
    to:
      value && typeof value === 'object' && 'to' in value
        ? (value.to as Date)
        : (value as Date),
  };
};

/**
 * Check if a date is disabled based on min/max constraints
 */
export const isDateDisabled = (
  date: Date,
  minDate: Date = new Date('1900-01-01'),
  maxDate: Date = new Date('2100-12-31'),
): boolean => {
  return date > maxDate || date < minDate;
};
