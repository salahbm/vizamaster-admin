import { ErrorTypes } from './types';

/**
 * API error codes for consistent error handling
 * Format: HTTP status code + specific error code
 * Example: 4010 = 401 (Unauthorized) + 0 (Generic unauthorized error)
 */
export const API_CODES = {
  // 200 Success (2000-2099)
  SUCCESS: 2000,

  // 400 Bad Request (4000-4099)
  BAD_REQUEST: 4000,
  INVALID_INPUT: 4001,
  MISSING_REQUIRED_FIELD: 4002,
  INVALID_FORMAT: 4003,

  // 401 Unauthorized (4010-4099)
  UNAUTHORIZED: 4010,
  INVALID_CREDENTIALS: 4011,
  EXPIRED_TOKEN: 4012,
  INVALID_TOKEN: 4013,
  NOT_AUTHORIZED_ROLE: 4014,
  ACCOUNT_INACTIVE: 4015,

  // 403 Forbidden (4030-4099)
  FORBIDDEN: 4030,
  INSUFFICIENT_PERMISSIONS: 4031,

  // 404 Not Found (4040-4099)
  NOT_FOUND: 4040,
  USER_NOT_FOUND: 4041,
  RESOURCE_NOT_FOUND: 4042,

  // 409 Conflict (4090-4099)
  CONFLICT: 4090,
  DUPLICATE_EMAIL: 4091,
  DUPLICATE_USERNAME: 4092,

  // 422 Validation Error (4220-4299)
  VALIDATION_ERROR: 4220,

  // 500 Server Error (5000-5099)
  SERVER_ERROR: 5000,
  DATABASE_ERROR: 5001,
  EXTERNAL_SERVICE_ERROR: 5002,
  FAILED_TO_CREATE_USER: 5003,
};

/* *****************************************************************
 * BETTER AUTH ERROR CODES
 * ***************************************************************** */

export const BETTER_AUTH_CODES = {
  USER_NOT_FOUND: 4041,
  FAILED_TO_CREATE_USER: 4221,
  FAILED_TO_CREATE_SESSION: 4222,
  FAILED_TO_UPDATE_USER: 4223,
  FAILED_TO_GET_SESSION: 4224,
  INVALID_PASSWORD: 4225,
  INVALID_EMAIL: 4226,
  INVALID_EMAIL_OR_PASSWORD: 4227,
  SOCIAL_ACCOUNT_ALREADY_LINKED: 4228,
  PROVIDER_NOT_FOUND: 4229,
  INVALID_TOKEN: 4230,
  ID_TOKEN_NOT_SUPPORTED: 4231,
  FAILED_TO_GET_USER_INFO: 4232,
  USER_EMAIL_NOT_FOUND: 4233,
  EMAIL_NOT_VERIFIED: 4234,
  PASSWORD_TOO_SHORT: 4235,
  PASSWORD_TOO_LONG: 4236,
  USER_ALREADY_EXISTS: 4237,
  EMAIL_CAN_NOT_BE_UPDATED: 4238,
  CREDENTIAL_ACCOUNT_NOT_FOUND: 4239,
  SESSION_EXPIRED: 4240,
  FAILED_TO_UNLINK_LAST_ACCOUNT: 4241,
  ACCOUNT_NOT_FOUND: 4242,
  USER_ALREADY_HAS_PASSWORD: 4243,
};

export const BETTER_AUTH_ERROR_MESSAGES = {
  USER_NOT_FOUND: {
    en: 'User not found',
    ru: 'Пользователь не найден',
  },
  FAILED_TO_CREATE_USER: {
    en: 'Failed to create user',
    ru: 'Не удалось создать пользователя',
  },
  FAILED_TO_UPDATE_USER: {
    en: 'Failed to update user',
    ru: 'Не удалось обновить пользователя',
  },
  USER_ALREADY_EXISTS: {
    en: 'User already exists',
    ru: 'Пользователь уже существует',
  },
  USER_EMAIL_NOT_FOUND: {
    en: 'User email not found',
    ru: 'Email пользователя не найден',
  },
  EMAIL_NOT_VERIFIED: {
    en: 'Email not verified',
    ru: 'Email не подтвержден',
  },
  EMAIL_CAN_NOT_BE_UPDATED: {
    en: 'Email cannot be updated',
    ru: 'Email нельзя изменить',
  },
  USER_ALREADY_HAS_PASSWORD: {
    en: 'User already has a password',
    ru: 'У пользователя уже есть пароль',
  },
  FAILED_TO_CREATE_SESSION: {
    en: 'Failed to create session',
    ru: 'Не удалось создать сессию',
  },
  FAILED_TO_GET_SESSION: {
    en: 'Failed to get session',
    ru: 'Не удалось получить сессию',
  },
  SESSION_EXPIRED: {
    en: 'Session expired',
    ru: 'Сессия истекла',
  },
  INVALID_PASSWORD: {
    en: 'Invalid password',
    ru: 'Неверный пароль',
  },
  INVALID_EMAIL: {
    en: 'Invalid email',
    ru: 'Неверный email',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    en: 'Invalid email or password',
    ru: 'Неверный email или пароль',
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    en: 'Credential account not found',
    ru: 'Учетная запись не найдена',
  },
  PASSWORD_TOO_SHORT: {
    en: 'Password too short',
    ru: 'Пароль слишком короткий',
  },
  PASSWORD_TOO_LONG: {
    en: 'Password too long',
    ru: 'Пароль слишком длинный',
  },
  PROVIDER_NOT_FOUND: {
    en: 'Provider not found',
    ru: 'Провайдер не найден',
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    en: 'Social account already linked',
    ru: 'Социальная учетная запись уже привязана',
  },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    en: 'Failed to unlink last account',
    ru: 'Не удалось отвязать последнюю учетную запись',
  },
  INVALID_TOKEN: {
    en: 'Invalid token',
    ru: 'Неверный токен',
  },
  ID_TOKEN_NOT_SUPPORTED: {
    en: 'ID token not supported',
    ru: 'ID токен не поддерживается',
  },
  FAILED_TO_GET_USER_INFO: {
    en: 'Failed to get user info',
    ru: 'Не удалось получить информацию о пользователе',
  },
} satisfies ErrorTypes;
