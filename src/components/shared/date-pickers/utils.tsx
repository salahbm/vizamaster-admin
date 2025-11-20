import React from 'react';

import { Locale, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useLocale } from 'next-intl';

import { FieldValueTypes } from '@/types/global';

/**
 * Format a date as YYYY-MM-DD string without timezone conversion
 * This is the proper way to store date-only values
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse a date from database/API without timezone conversion
 * Uses yyyy/mm/dd format to avoid timezone issues
 */
export const parseDateOnly = (
  dateValue: string | Date | null | undefined,
): Date | undefined => {
  if (!dateValue) return undefined;

  const dateStr =
    typeof dateValue === 'string' ? dateValue : dateValue.toISOString();

  // Replace dashes with slashes to avoid timezone conversion
  // yyyy-mm-dd considers timezone, yyyy/mm/dd does not
  const normalizedDate = dateStr.split('T')[0].replace(/-/g, '/');

  return new Date(normalizedDate);
};

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

  // Create a new date to avoid mutation
  const dateToSave = new Date(newDate);

  if (variant === 'date-time' && selectedTime) {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    dateToSave.setHours(hours || 0, minutes || 0, 0, 0);
  } else {
    // For date-only variants, set to local midnight
    dateToSave.setHours(0, 0, 0, 0);
  }

  onValueChange(dateToSave);
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

/**
 * Normalize a date-only value to UTC midnight for API submission
 * This prevents timezone offset issues when the date is serialized to JSON
 */
export const normalizeDateForSubmission = (
  date: Date | null | undefined,
): Date | null => {
  if (!date) return null;

  // Create a new date at UTC midnight using the local date values
  const normalized = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
  );

  return normalized;
};
