import { NextResponse } from 'next/server';

import { Prisma } from '@/generated/prisma';

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

  constructor(message = 'Validation failed', errors?: unknown, code = 4220) {
    super(message, 422, code);
    this.errors = errors as Record<string, string[]>;
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', code = 5000) {
    super(message, 500, code);
  }
}

export async function handleApiError(error: unknown): Promise<NextResponse> {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    // If it's already an ApiError, use it directly
    apiError = error;
  } else {
    // Fallback for unhandled errors (e.g., raw Error or unknown)
    apiError = new InternalServerError(
      error instanceof Error ? error.message : 'Something went wrong',
      5000,
    );
    console.error('Unhandled error:', error); // Log for debugging
  }

  return NextResponse.json(
    {
      message: apiError.message,
      code: apiError.code,
      data: apiError.data,
      ...(apiError instanceof ValidationError && apiError.errors
        ? { errors: apiError.errors }
        : {}),
    },
    { status: apiError.status },
  );
}

export function handlePrismaError(
  error: unknown,
  resource: string = 'Resource',
): ApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ConflictError(`${resource} already exists`, 4091);
      case 'P2025':
        return new NotFoundError(`${resource} not found`, 4041);
      case 'P2000':
        return new ValidationError(
          'Invalid input data',
          Array.isArray(error.meta)
            ? (error.meta as Record<string, string[]>)
            : {},
          4221,
        );
      // Add other common Prisma error codes as needed
      default:
        return new InternalServerError(
          `Database error: ${error.message}`,
          5001,
        );
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Invalid database query', undefined, 4222);
  }
  // For non-Prisma errors, rethrow or wrap as generic
  return new InternalServerError(
    `Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`,
    5000,
  );
}
