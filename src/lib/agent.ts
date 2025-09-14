/**
 * API Agent for handling HTTP requests
 * This module provides a centralized way to make API calls with proper error handling and type safety
 */
import { getTranslations } from 'next-intl/server';

import { ApiError } from '@/server/common/errors';
import { PaginatedResult } from '@/server/common/types';

// HTTP methods supported by the agent
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Configuration options for requests
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

// Next.js specific fetch request config
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Main API agent class for handling HTTP requests
 */
class Agent {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Set the base URL for API requests
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  /**
   * Add an authorization header with a bearer token
   */
  setBearerToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  /**
   * Remove the authorization header
   */
  clearBearerToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  /**
   * Create the full URL with query parameters
   */
  private createUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    // Remove leading slash if present to avoid double slashes
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint;

    // Combine base URL and endpoint
    const url = this.baseUrl
      ? `${this.baseUrl}/${normalizedEndpoint}`
      : `/${normalizedEndpoint}`;

    // Add query parameters if provided
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });

      const queryString = searchParams.toString();
      if (queryString) {
        return `${url}?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Process the API response
   */
  private async processResponse<T>(response: Response): Promise<T> {
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    // Parse the response body
    const data = isJson ? await response.json() : await response.text();

    // Handle error responses
    if (!response.ok) {
      const errorMessage =
        isJson && data.error
          ? data.error
          : isJson && data.message
            ? data.message
            : `API Error: ${response.statusText}`;

      const errorCode = isJson && data.code ? data.code : undefined;

      throw new ApiError(
        errorMessage,
        response.status,
        errorCode,
        isJson ? data : undefined,
      );
    }

    // Return the data for successful responses
    return data as T;
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const { headers = {}, params, signal, cache, next } = options;

    // Create the full URL with query parameters
    const url = this.createUrl(endpoint, params);

    // Prepare the request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      signal,
      cache,
      next,
    };

    // Add the request body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      // Make the request
      const response = await fetch(url, requestOptions);
      return this.processResponse<T>(response);
    } catch (error) {
      // Handle fetch errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Convert other errors to ApiError
      throw new ApiError(
        (error as Error).message || 'Network error',
        0, // No status code for network errors
        0,
        error,
      );
    }
  }

  /**
   * Make a GET request
   */
  get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * Make a POST request
   */
  post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  /**
   * Make a PUT request
   */
  put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  /**
   * Make a PATCH request
   */
  patch<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * Make a DELETE request
   */
  delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Get a paginated list of items
   */
  getPaginated<T>(
    endpoint: string,
    page = 1,
    size = 10,
    search = '',
    options: RequestOptions = {},
  ): Promise<PaginatedResult<T>> {
    return this.get<PaginatedResult<T>>(endpoint, {
      ...options,
      params: {
        ...(options.params || {}),
        page,
        size,
        ...(search ? { search } : {}),
      },
    });
  }
}

// Create and export a singleton instance
export const agent = new Agent();

// Export a function to get a translated error message
export async function getErrorMessage(error: unknown): Promise<string> {
  try {
    const t = await getTranslations();

    if (error instanceof ApiError) {
      // Return specific error message if available
      return error.message || t('errors.generic');
    }

    if (error instanceof Error) {
      return error.message || t('errors.generic');
    }

    return t('errors.generic');
  } catch {
    // Fallback if translations fail
    return 'An unexpected error occurred';
  }
}

// Export the ApiError class for type checking
export default agent;
