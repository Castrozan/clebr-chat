// API Request types
export interface McpInitializeRequest {
  mcpServerUrls: string[];
}

export interface ChatRequest {
  message: string;
  sessionId: string;
}

// API Response types
export interface McpInitializeResponse {
  sessionId: string;
  success: boolean;
  fallbackMode?: boolean;
  error?: string;
  servers?: Array<{
    url: string;
    status: "connected" | "disconnected" | "error";
    error?: string;
  }>;
  tools?: Array<{
    name: string;
    description?: string;
    parameters?: Record<string, any>;
  }>;
}

export interface ChatResponse {
  response: string;
  error?: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// HTTP Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API Configuration
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// API Endpoints
export const API_ENDPOINTS = {
  MCP_INITIALIZE: "/mcp/initialize",
  CHAT: "/chat",
} as const;

// API Client interface
export interface ApiClient {
  get: <T>(url: string, config?: Partial<ApiConfig>) => Promise<ApiResponse<T>>;
  post: <T>(
    url: string,
    data?: any,
    config?: Partial<ApiConfig>
  ) => Promise<ApiResponse<T>>;
  put: <T>(
    url: string,
    data?: any,
    config?: Partial<ApiConfig>
  ) => Promise<ApiResponse<T>>;
  delete: <T>(
    url: string,
    config?: Partial<ApiConfig>
  ) => Promise<ApiResponse<T>>;
}
