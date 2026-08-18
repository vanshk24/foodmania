export interface HealthResponse {
  status: string;
  message: string;
  version: string;
  timestamp?: string;
  uptime?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}
