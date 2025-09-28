import { ColumnSort } from '@tanstack/react-table';

import { Prisma } from '@/generated/prisma';
import { ISort } from '@/types/data-table';

import { BETTER_AUTH_CODES, BETTER_AUTH_ERROR_MESSAGES } from './codes';
import { PaginatedResult, PaginationParams } from './types';

/**
 * Create Response object
 */
export function createResponse<T>(
  data?: T,
  status: number = 200,
  message: string = 'Success',
  code: number = 2000,
) {
  return {
    status,
    message,
    code,
    ...(data !== undefined && { data }),
  };
}

export function createInfinityResponse<T>(
  data: T[],
  nextCursor: string | null,
  hasMore: boolean,
) {
  return {
    data,
    nextCursor,
    hasMore,
  };
}

/**
 * Builds pagination parameters for database queries
 */
export function buildPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const size = Math.max(1, Math.min(100, params.size || 50));
  const skip = (page - 1) * size;

  return {
    skip,
    take: size,
    page,
    size,
  };
}

/**
 * Creates a paginated result object
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  { page, size }: { page: number; size: number },
): PaginatedResult<T> {
  return {
    data,
    meta: {
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    },
  };
}

/**
 * Parses pagination parameters from URL search parameters
 */

export function parsePaginationAndSortParams(searchParams: URLSearchParams) {
  let page = 1;
  let size = 50;
  let sort: ISort | undefined;

  const pageParam = searchParams.get('page');
  if (pageParam) {
    const parsed = parseInt(pageParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      page = parsed;
    }
  }

  const sizeParam = searchParams.get('size');
  if (sizeParam) {
    const parsed = parseInt(sizeParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      size = parsed;
    }
  }

  const sortParam = searchParams.get('sort');
  if (sortParam) {
    try {
      sort = JSON.parse(sortParam);
    } catch (error) {
      console.error('Error parsing sort parameter:', error);
    }
  }

  return { page, size, sort };
}

/**
 * Builds sort parameters for Prisma queries
 */
export function buildOrderBy<T extends string = string>(
  sort: ColumnSort[] | ColumnSort | undefined,
  defaultKey: T = 'createdAt' as T,
  defaultDir: Prisma.SortOrder = 'desc',
): Prisma.UsersOrderByWithRelationInput {
  if (Array.isArray(sort) && sort.length > 0) {
    const { id, desc } = sort[0];
    return { [id]: (desc ? 'desc' : 'asc') as Prisma.SortOrder };
  }
  if (sort && !Array.isArray(sort)) {
    return { [sort.id]: (sort.desc ? 'desc' : 'asc') as Prisma.SortOrder };
  }
  return { [defaultKey]: defaultDir };
}

/**
 * Get error message based on code and language
 */
export const getErrorMessage = (code: string, lang: 'en' | 'ru') => {
  if (code in BETTER_AUTH_CODES) {
    return BETTER_AUTH_ERROR_MESSAGES[
      code as keyof typeof BETTER_AUTH_ERROR_MESSAGES
    ][lang];
  }
  return '';
};

/**
 * Generate 6 character string containing numbers and letters for userId
 */
export const generateUserId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let userId = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userId += characters.charAt(randomIndex);
  }
  return userId;
};
