/**
 * @jest-environment jsdom
 */

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

// Import the actual StorageService implementation
const { StorageService } = jest.requireActual(
  "../../lib/utils/storage"
) as typeof import("../../lib/utils/storage");

// Create a simple localStorage mock
const createLocalStorageMock = () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};

describe("StorageService", () => {
  let mockLocalStorage: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    // Create fresh localStorage mock for each test
    mockLocalStorage = createLocalStorageMock();

    // Replace window.localStorage
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    // Also replace global localStorage
    Object.defineProperty(global, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMcpServers", () => {
    it("should return empty array when no servers stored", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = StorageService.getMcpServers();

      expect(result).toEqual([]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("mcp_servers");
    });

    it("should return parsed servers when stored", () => {
      const mockServers = [
        { url: "http://localhost:3001/mcp", status: "connected" as const },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockServers));

      const result = StorageService.getMcpServers();

      expect(result).toEqual(mockServers);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("mcp_servers");
    });

    it("should return empty array on parse error", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json");

      const result = StorageService.getMcpServers();

      expect(result).toEqual([]);
    });
  });

  describe("saveMcpServers", () => {
    it("should save servers to localStorage", () => {
      const servers = [
        { url: "http://localhost:3001/mcp", status: "connected" as const },
      ];

      StorageService.saveMcpServers(servers);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "mcp_servers",
        JSON.stringify(servers)
      );
    });
  });

  describe("getMcpSession", () => {
    it("should return null when no session stored", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = StorageService.getMcpSession();

      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("mcp_session");
    });

    it("should return parsed session when stored", () => {
      const mockSession = {
        sessionId: "test-session",
        success: true,
        timestamp: "2024-01-01T00:00:00.000Z",
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSession));

      const result = StorageService.getMcpSession();

      expect(result).toEqual(mockSession);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("mcp_session");
    });

    it("should return null on parse error", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json");

      const result = StorageService.getMcpSession();

      expect(result).toBeNull();
    });
  });

  describe("saveMcpSession", () => {
    it("should save session to localStorage", () => {
      const session = {
        sessionId: "test-session",
        success: true,
        timestamp: "2024-01-01T00:00:00.000Z",
      };

      StorageService.saveMcpSession(session);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "mcp_session",
        JSON.stringify(session)
      );
    });
  });

  describe("clearMcpSession", () => {
    it("should remove session from localStorage", () => {
      StorageService.clearMcpSession();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("mcp_session");
    });
  });

  describe("clearAllMcpData", () => {
    it("should clear all MCP data from localStorage", () => {
      StorageService.clearAllMcpData();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("mcp_servers");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("mcp_session");
    });
  });
});
