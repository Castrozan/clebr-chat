/**
 * @jest-environment jsdom
 */

// Unmock zustand for store tests to use real implementation
jest.unmock("zustand");

import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

// Mock external dependencies
const mockApiService = {
  initializeMcp: jest.fn<() => Promise<any>>(),
};

jest.mock("../../src/lib/services/api", () => ({
  ApiService: mockApiService,
}));

// Import the actual store implementation
const { useMcpStore } = jest.requireActual(
  "../../src/lib/stores/mcpStore"
) as typeof import("../../src/lib/stores/mcpStore");

describe("McpStore", () => {
  beforeEach(() => {
    // Reset the store to initial state
    useMcpStore.setState({
      servers: [],
      sessionData: null,
      connectionStatus: "disconnected",
      statusText: "Not connected",
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  describe("State Management", () => {
    it("has correct initial state", () => {
      const state = useMcpStore.getState();

      expect(state.servers).toEqual([]);
      expect(state.sessionData).toBe(null);
      expect(state.connectionStatus).toBe("disconnected");
      expect(state.statusText).toBe("Not connected");
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it("adds server correctly", () => {
      const { addServer } = useMcpStore.getState();

      addServer("http://localhost:3001");

      const state = useMcpStore.getState();
      expect(state.servers).toHaveLength(1);
      expect(state.servers[0].url).toBe("http://localhost:3001");
      expect(state.servers[0].status).toBe("disconnected");
    });

    it("removes server correctly", () => {
      const { addServer, removeServer } = useMcpStore.getState();

      addServer("http://localhost:3001");
      addServer("http://localhost:3002");
      removeServer(0);

      const state = useMcpStore.getState();
      expect(state.servers).toHaveLength(1);
      expect(state.servers[0].url).toBe("http://localhost:3002");
    });

    it("updates server URL correctly", () => {
      const { addServer, updateServerUrl } = useMcpStore.getState();

      addServer("http://localhost:3001");
      updateServerUrl(0, "http://localhost:3002");

      const state = useMcpStore.getState();
      expect(state.servers[0].url).toBe("http://localhost:3002");
    });

    it("updates server status correctly", () => {
      const { addServer, updateServerStatus } = useMcpStore.getState();

      addServer("http://localhost:3001");
      updateServerStatus("http://localhost:3001", "connected");

      const state = useMcpStore.getState();
      expect(state.servers[0].status).toBe("connected");
    });

    it("sets connection status correctly", () => {
      const { setConnectionStatus } = useMcpStore.getState();

      setConnectionStatus("connected", "Connected to servers");

      const state = useMcpStore.getState();
      expect(state.connectionStatus).toBe("connected");
      expect(state.statusText).toBe("Connected to servers");
    });

    it("sets session data correctly", () => {
      const { setSessionData } = useMcpStore.getState();

      const sessionData = {
        sessionId: "test-session",
        success: true,
        servers: [],
      };

      setSessionData(sessionData);

      const state = useMcpStore.getState();
      expect(state.sessionData).toEqual(sessionData);
    });

    it("sets loading state correctly", () => {
      const { setLoading } = useMcpStore.getState();

      setLoading(true);
      expect(useMcpStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useMcpStore.getState().isLoading).toBe(false);
    });

    it("sets error state correctly", () => {
      const { setError } = useMcpStore.getState();

      setError("Test error");
      expect(useMcpStore.getState().error).toBe("Test error");

      setError(null);
      expect(useMcpStore.getState().error).toBe(null);
    });
  });

  describe("Server Operations", () => {
    it("handles multiple servers", () => {
      const { addServer } = useMcpStore.getState();

      addServer("http://localhost:3001");
      addServer("http://localhost:3002");
      addServer("http://localhost:3003");

      const state = useMcpStore.getState();
      expect(state.servers).toHaveLength(3);
      expect(state.servers[0].url).toBe("http://localhost:3001");
      expect(state.servers[1].url).toBe("http://localhost:3002");
      expect(state.servers[2].url).toBe("http://localhost:3003");
    });

    it("updates correct server by URL", () => {
      const { addServer, updateServerStatus } = useMcpStore.getState();

      addServer("http://localhost:3001");
      addServer("http://localhost:3002");
      updateServerStatus("http://localhost:3002", "connected");

      const state = useMcpStore.getState();
      expect(state.servers[0].status).toBe("disconnected");
      expect(state.servers[1].status).toBe("connected");
    });
  });

  describe("Async Operations", () => {
    it("handles initializeMcp successfully", async () => {
      const mockResponse = {
        sessionId: "test-session",
        success: true,
        servers: [
          { url: "http://localhost:3001", status: "connected" as const },
        ],
      };
      mockApiService.initializeMcp.mockResolvedValueOnce(mockResponse);

      const { initializeMcp } = useMcpStore.getState();
      await initializeMcp(["http://localhost:3001"]);

      const state = useMcpStore.getState();
      expect(state.sessionData).toEqual(mockResponse);
      expect(state.connectionStatus).toBe("connected");
      expect(state.statusText).toBe("Connected to MCP servers");
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it("handles initializeMcp with errors", async () => {
      mockApiService.initializeMcp.mockRejectedValueOnce(
        new Error("Network error")
      );

      const { initializeMcp } = useMcpStore.getState();
      await initializeMcp(["http://localhost:3001"]);

      const state = useMcpStore.getState();
      expect(state.connectionStatus).toBe("error");
      expect(state.error).toBe("Network error");
      expect(state.isLoading).toBe(false);
    });

    it("handles testServerConnection successfully", async () => {
      const { addServer, testServerConnection } = useMcpStore.getState();

      addServer("http://localhost:3001");
      mockApiService.initializeMcp.mockResolvedValueOnce({
        success: true,
        sessionId: "test",
      });

      const result = await testServerConnection("http://localhost:3001");

      expect(result).toBe(true);
      const state = useMcpStore.getState();
      expect(state.servers[0].status).toBe("connected");
    });

    it("handles testServerConnection failure", async () => {
      const { addServer, testServerConnection } = useMcpStore.getState();

      addServer("http://localhost:3001");
      mockApiService.initializeMcp.mockRejectedValueOnce(
        new Error("Connection failed")
      );

      const result = await testServerConnection("http://localhost:3001");

      expect(result).toBe(false);
      const state = useMcpStore.getState();
      expect(state.servers[0].status).toBe("error");
      expect(state.servers[0].error).toBe("Connection failed");
    });
  });
});
