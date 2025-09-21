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

export const COUNTRY_CODE_MAP: Record<string, string> = {
  UK: 'GB', // United Kingdom
  EL: 'GR', // Greece
  TP: 'TL', // Timor-Leste
  BU: 'MM', // Myanmar/Burma
  ZR: 'CD', // Congo (Kinshasa)
  LP: 'LA', // Laos
  BJ: 'BO', // Bolivia
  BRU: 'BN', // Brunei
  KS: 'XK', // Kosovo (not officially ISO, sometimes used)
  SF: 'ZA', // South Africa (old code SF → ZA)
  YU: 'RS', // Yugoslavia → Serbia
  SU: 'RU', // Soviet Union → Russia
  AN: 'CW', // Netherlands Antilles → Curaçao
};

/**
 * Returns a list of countries with their ISO codes and localized names
 * @returns Array of country objects with value (ISO code) and label (localized name)
 */
export const getCountries = (): Array<{ value: string; label: string }> => {
  const getLocale = Cookies.get(COOKIE_KEYS.LANGUAGE) ?? 'ru';

  const countriesList = countries.getNames(getLocale, { select: 'official' });
  return Object.entries(countriesList)
    .map(([code, name]) => ({
      value: code,
      label: name,
      className: 'capitalize',
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const getLanguages = (): Array<{ value: string; label: string }> => {
  const getLocale = Cookies.get(COOKIE_KEYS.LANGUAGE) ?? 'ru';

  return Object.keys(i18nLanguages.getNames(getLocale)) // all codes
    .map((code) => ({
      value: code,
      label: i18nLanguages.getName(code, getLocale) ?? code,
      className: 'capitalize',
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};
