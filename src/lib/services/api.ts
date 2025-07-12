import type {
  ChatRequest,
  ChatResponse,
  McpInitializeRequest,
  McpInitializeResponse,
} from "../../types/api";

const API_BASE_URL = "http://127.0.0.1:3004";

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async initializeMcp(
    request: McpInitializeRequest
  ): Promise<McpInitializeResponse> {
    return this.request<McpInitializeResponse>("/mcp/initialize", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  static async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}
