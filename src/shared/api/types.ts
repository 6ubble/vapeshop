export interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  
  export interface ErrorResponse {
    success: false;
    error: string;
    message?: string;
    code?: string;
  }