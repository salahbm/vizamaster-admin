import { NextResponse } from 'next/server';

// Base API error class
export class ApiError extends Error {
  status: number;
  code: number;
  data?: unknown;

  constructor(message: string, status: number, code: number, data?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
    this.data = data;
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

export async function handleApiError(
  errorOrMessage?: string | unknown,
  status?: number,
  code?: number,
): Promise<NextResponse> {
  let apiError: ApiError;

  if (errorOrMessage === '' || errorOrMessage === undefined) {
    apiError = new ApiError(
      errorOrMessage || 'Something went wrong',
      status || 500,
      code || 5000,
    );
  } else {
    apiError = new ApiError(
      'Something went wrong',
      status || 500,
      code || 5000,
    );
  }

  console.error('ERROR IN ROUTE ERR HANLDLER', errorOrMessage, status, code);

  return NextResponse.json(
    {
      message: apiError.message,
      code: apiError.code,
      data: apiError.data,
    },
    { status: apiError.status },
  );
}
