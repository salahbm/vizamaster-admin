import { Locale, format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

type SupportedLocale = 'en' | 'ru';

// Map locale codes to date-fns locale objects
const dateLocales: Record<SupportedLocale, Locale> = {
  en: enUS,
  ru: ru,
};

/**
 * Format a date using date-fns with the appropriate locale
 * @param date The date to format
 * @param formatStr The format string to use
 * @param locale The locale code (e.g., 'en', 'ru')
 * @returns The formatted date string
 */
export function formatDate(
  date?: Date | number,
  formatStr?: string,
  locale?: SupportedLocale,
): string {
  return format(date ?? '', formatStr ?? 'yyyy-MM-dd', {
    locale: dateLocales[locale ?? 'ru'],
  });
}

/**
 * Convert a date to an ISO string
 * @param date The date to convert
 * @returns The ISO string representation of the date
 */
export const normalizeToUTC = (date: Date): string => {
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  return utc.toISOString(); // e.g., "2000-05-10T00:00:00.000Z"
};

/**
 * Convert an ISO string to a date
 * @param isoString The ISO string to convert
 * @returns The date representation of the ISO string
 */
export const isoToLocalDate = (iso?: string): Date =>
  iso
    ? new Date(
        Date.UTC(
          new Date(iso).getUTCFullYear(),
          new Date(iso).getUTCMonth(),
          new Date(iso).getUTCDate(),
        ),
      )
    : new Date();

/**
 * Get the year from a date
 * @param date The date to get the year from
 * @returns The year of the date
 */
export const dateToYear = (date?: Date): number =>
  date ? date.getFullYear() : 0;

/**
 * Get the year from a date
 * @param year The year to get the date from
 * @returns The date of the year
 */
export const yearToDate = (year?: number): Date =>
  year ? new Date(year, 0, 1) : new Date();

/**
 * Get the month from a date
 * @param date The date to get the month from
 * @returns The month of the date
 */
export const dateToMonth = (date?: Date): number =>
  date ? date.getMonth() : 0;

/**
 * Get the month from a date
 * @param month The month to get the date from
 * @returns The date of the month
 */
export const monthToDate = (month?: number): Date =>
  month ? new Date(month, 0, 1) : new Date();

export const getLastSixMonths = (): Date => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() - 6);
  return nextMonth;
};

export const getNextSixMonths = (): Date => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 6);
  return nextMonth;
};
