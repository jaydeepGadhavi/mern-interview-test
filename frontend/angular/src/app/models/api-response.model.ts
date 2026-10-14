export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  details?: string[];
}
