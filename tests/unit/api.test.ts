/**
 * @jest-environment jsdom
 */

// Import the actual ApiService implementation
const { ApiService } = jest.requireActual(
  "../../lib/services/api"
) as typeof import("../../lib/services/api");
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

// Create a simple fetch mock
const createMockResponse = (
  data: any,
  ok = true,
  status = 200,
  statusText = "OK"
) =>
  ({
    ok,
    status,
    statusText,
    json: jest.fn<() => Promise<any>>().mockResolvedValue(data),
  } as unknown as Response);

describe("ApiService", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Store original fetch
    originalFetch = global.fetch;
    // Mock fetch
    global.fetch = jest.fn() as any;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  describe("initializeMcp", () => {
    it("calls correct endpoint with POST method", async () => {
      const mockResponse = { sessionId: "test", success: true };
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockResponse) as Response
      );

      const request = { mcpServerUrls: ["http://localhost:3001"] };
      const result = await ApiService.initializeMcp(request);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://127.0.0.1:3004/mcp/initialize",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(request),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("returns response data on success", async () => {
      const mockResponse = { sessionId: "test", success: true };
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockResponse) as Response
      );

      const request = { mcpServerUrls: ["http://localhost:3001"] };
      const result = await ApiService.initializeMcp(request);

      expect(result).toEqual(mockResponse);
    });

    it("throws error on API failure", async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(
          null,
          false,
          500,
          "Internal Server Error"
        ) as Response
      );

      const request = { mcpServerUrls: ["http://localhost:3001"] };

      await expect(ApiService.initializeMcp(request)).rejects.toThrow(
        "API request failed: 500 Internal Server Error"
      );
    });

    it("throws error on network failure", async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const request = { mcpServerUrls: ["http://localhost:3001"] };

      await expect(ApiService.initializeMcp(request)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("sendChatMessage", () => {
    it("calls correct endpoint with POST method", async () => {
      const mockResponse = { response: "Hello", error: null };
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockResponse) as Response
      );

      const request = { message: "Hello", sessionId: "test" };
      const result = await ApiService.sendChatMessage(request);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://127.0.0.1:3004/chat",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(request),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("returns response data on success", async () => {
      const mockResponse = { response: "Hello", error: null };
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockResponse) as Response
      );

      const request = { message: "Hello", sessionId: "test" };
      const result = await ApiService.sendChatMessage(request);

      expect(result).toEqual(mockResponse);
    });

    it("throws error on API failure", async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(null, false, 400, "Bad Request") as Response
      );

      const request = { message: "Hello", sessionId: "test" };

      await expect(ApiService.sendChatMessage(request)).rejects.toThrow(
        "API request failed: 400 Bad Request"
      );
    });

    it("throws error on network failure", async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const request = { message: "Hello", sessionId: "test" };

      await expect(ApiService.sendChatMessage(request)).rejects.toThrow(
        "Network error"
      );
    });

    it("handles successful response with data", async () => {
      const mockResponse = { response: "AI response", error: null };
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockResponse) as Response
      );

      const request = { message: "Hello", sessionId: "test" };
      const result = await ApiService.sendChatMessage(request);

      expect(result.response).toBe("AI response");
      expect(result.error).toBe(null);
    });

    it("handles response with error field", async () => {
      const mockResponse = { response: null, error: "Processing failed" };
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce(
        createMockResponse(mockResponse) as Response
      );

      const request = { message: "Hello", sessionId: "test" };
      const result = await ApiService.sendChatMessage(request);

      expect(result.response).toBe(null);
      expect(result.error).toBe("Processing failed");
    });
  });
});
