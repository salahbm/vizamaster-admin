'use client';

import i18nLanguages from '@cospired/i18n-iso-languages';
import enLang from '@cospired/i18n-iso-languages/langs/en.json';
import ruLang from '@cospired/i18n-iso-languages/langs/ru.json';
import * as countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import ru from 'i18n-iso-countries/langs/ru.json';
import Cookies from 'js-cookie';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

import { COOKIE_KEYS } from '@/constants/cookies';

countries.registerLocale(en);
countries.registerLocale(ru);

i18nLanguages.registerLocale(ruLang);
i18nLanguages.registerLocale(enLang);

export const validatePhone = (value: string, country = 'US') => {
  const phone = parsePhoneNumberFromString(value, country as CountryCode);
  return phone?.isValid() ? phone.formatInternational() : null;
};

/**
 * @description should be central asian country codes and india, nepal, russia
 */
export const COUNTRY_CODE_MAP: Record<string, string> = {
  uzbekistan: 'UZ',
  india: 'IN',
  nepal: 'NP',
  russia: 'RU',
  kazakhstan: 'KZ',
  kyrgyzstan: 'KG',
  turkmenistan: 'TM',
  ukraine: 'UA',
  tajikistan: 'TJ',
};

/**
 * Returns a list of countries with their ISO codes and localized names
 * @returns Array of country objects with value (ISO code) and label (localized name)
 */
export const getCountries = (): Array<{ value: string; label: string }> => {
  const getLocale = Cookies.get(COOKIE_KEYS.LANGUAGE) ?? 'ru';

  const countriesList = countries.getNames(getLocale, { select: 'official' });
  return Object.entries(countriesList)
    .filter(([code]) => COUNTRY_CODE_MAP[code])
    .map(([code, name]) => ({
      value: code,
      label: name,
      className: 'capitalize',
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Returns a list of languages with their ISO codes and localized names
 * @returns array of languages
 */
export const getLanguages = (): Array<{
  value: string;
  label: string;
  className?: string;
}> => {
  const getLocale = Cookies.get(COOKIE_KEYS.LANGUAGE) ?? 'ru';

  // manually chosen 15 languages (adjust if you want different ones)
  const manualTop15 = [
    'en',
    'zh',
    'es',
    'ar',
    'fr',
    'ru',
    'pt',
    'bn',
    'id',
    'ur',
    'de',
    'ja',
    'pa',
  ];

  const extras = ['uz', 'ne', 'hi', 'tg'];

  const codes = Array.from(new Set([...manualTop15, ...extras]))?.sort((a, b) =>
    a.localeCompare(b),
  ); // keep manual order, then extras

  return codes.map((code) => ({
    value: code,
    label: i18nLanguages.getName(code, getLocale) ?? code,
    className: 'capitalize',
  }));
};
