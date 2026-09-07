export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[] | Record<string, string[]>;
  statusCode: number;
  timestamp?: string;
}

export interface IPaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
