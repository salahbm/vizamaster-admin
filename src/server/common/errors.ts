// Base API error class
export class ApiError extends Error {
  status: number;
  code: number;

  constructor(message: string, status: number, code: number) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', code = 4000) {
    super(message, 400, code);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', code = 4010) {
    super(message, 401, code);
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', code = 4030) {
    super(message, 403, code);
  }
}

// 404 Not Found
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', code = 4040) {
    super(message, 404, code);
  }
}

// 409 Conflict
export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists', code = 4090) {
    super(message, 409, code);
  }
}

// 422 Unprocessable Entity
export class ValidationError extends ApiError {
  errors?: Record<string, string[]>;

  constructor(
    message = 'Validation failed',
    errors?: Record<string, string[]>,
    code = 4220,
  ) {
    super(message, 422, code);
    this.errors = errors;
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', code = 5000) {
    super(message, 500, code);
  }
}

// Error handler function
export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message);
  }

  return new InternalServerError('An unknown error occurred');
}

/**
 * Standard API response format
 * @param status HTTP status code (e.g., 200, 400, 404)
 * @param code HTTP status code (e.g., 200, 400, 404)
 * @param message Response message
 * @param data Optional data payload
 * @returns Standardized API response object
 */
export function apiResponse<T = unknown>(
  status: number,
  code: number,
  message: string,
  data: T | null = null,
) {
  return {
    status,
    code,
    message,
    data,
  };
}
