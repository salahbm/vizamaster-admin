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

export function handleApiError(
  errorOrMessage: unknown,
  status?: number,
  code?: number,
): ApiError {
  // If first argument is an error object
  if (typeof errorOrMessage !== 'string') {
    if (errorOrMessage instanceof ApiError) {
      return errorOrMessage;
    }

    if (errorOrMessage instanceof Error) {
      return new InternalServerError(errorOrMessage.message);
    }

    return new InternalServerError('An unknown error occurred');
  }

  // If first argument is a message string
  if (status && code) {
    return new ApiError(errorOrMessage as string, status, code);
  }

  return new InternalServerError(errorOrMessage as string);
}
