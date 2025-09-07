import { Locale, format, formatDistance, formatRelative } from 'date-fns';
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
  date: Date | number,
  formatStr: string,
  locale: SupportedLocale,
): string {
  return format(date, formatStr, { locale: dateLocales[locale] });
}

/**
 * Format the distance between two dates with the appropriate locale
 * @param date The date to compare to baseDate
 * @param baseDate The base date to compare from
 * @param locale The locale code (e.g., 'en', 'ru')
 * @returns The formatted distance string
 */
export function formatDateDistance(
  date: Date | number,
  baseDate: Date | number,
  locale: SupportedLocale,
): string {
  return formatDistance(date, baseDate, { locale: dateLocales[locale] });
}

/**
 * Format a date relative to the current date with the appropriate locale
 * @param date The date to format
 * @param baseDate The base date to compare from
 * @param locale The locale code (e.g., 'en', 'ru')
 * @returns The formatted relative date string
 */
export function formatDateRelative(
  date: Date | number,
  baseDate: Date | number,
  locale: SupportedLocale,
): string {
  return formatRelative(date, baseDate, { locale: dateLocales[locale] });
}

/**
 * Get the full locale code for a given locale
 * @param locale The locale code (e.g., 'en', 'ru')
 * @returns The full locale code (e.g., 'en-US', 'ru-RU')
 */
export function getFullLocale(locale: SupportedLocale): string {
  return locale;
}
