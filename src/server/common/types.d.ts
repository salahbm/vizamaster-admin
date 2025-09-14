// Input parameters for pagination functions
export type PaginationParams = {
  page?: number;
  size?: number;
};

// Metadata for paginated results
export type PaginationMeta = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

// Complete paginated result structure
export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
