import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { jest } from "@jest/globals";

// ============================================================
// MOCK DATA FACTORIES
// ============================================================

export const createMockMessage = (overrides = {}) => ({
  id: `msg-${Date.now()}`,
  content: "Test message",
  isUser: true,
  timestamp: new Date(),
  ...overrides,
});

export const createMockServer = (overrides = {}) => ({
  url: "http://localhost:3001",
  status: "disconnected" as const,
  ...overrides,
});

export const createMockSessionData = (overrides = {}) => ({
  sessionId: "test-session",
  success: true,
  servers: [],
  ...overrides,
});

// ============================================================
// STORE MOCK FACTORIES
// ============================================================

export const createMockChatStore = (overrides = {}) => ({
  // State
  messages: [],
  isLoading: false,
  error: null,
  inputValue: "",
  // Actions
  addMessage: jest.fn(),
  updateMessage: jest.fn(),
  clearMessages: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  setInputValue: jest.fn(),
  sendMessage: jest.fn(),
  ...overrides,
});

export const createMockMcpStore = (overrides = {}) => ({
  // State
  servers: [],
  sessionData: null,
  connectionStatus: "disconnected" as const,
  statusText: "Not connected",
  isLoading: false,
  error: null,
  // Actions
  addServer: jest.fn(),
  removeServer: jest.fn(),
  updateServerUrl: jest.fn(),
  updateServerStatus: jest.fn(),
  setConnectionStatus: jest.fn(),
  setSessionData: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  initializeMcp: jest.fn(),
  testServerConnection: jest.fn(),
  ...overrides,
});

// ============================================================
// GLOBAL MOCK SERVICES
// ============================================================

export const mockApiService = {
  initializeMcp: jest.fn() as jest.MockedFunction<any>,
  sendChatMessage: jest.fn() as jest.MockedFunction<any>,
};

export const mockStorageService = {
  getMcpServers: jest.fn(() => []),
  saveMcpServers: jest.fn(),
};

export const mockRouterService = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

// ============================================================
// TEST UTILITIES
// ============================================================

export const resetAllMocks = () => {
  jest.clearAllMocks();

  // Reset API service mocks
  mockApiService.initializeMcp.mockResolvedValue({
    success: true,
    sessionId: "test-session",
  });
  mockApiService.sendChatMessage.mockResolvedValue({
    response: "Test response",
  });

  // Reset storage service mocks
  mockStorageService.getMcpServers.mockReturnValue([]);
  mockStorageService.saveMcpServers.mockReturnValue(undefined);
};

// ============================================================
// CUSTOM RENDER FUNCTION
// ============================================================

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };

// ============================================================
// JEST SETUP UTILITIES
// ============================================================

// Call this in beforeEach of every test
export const setupTest = () => {
  resetAllMocks();

  // Reset mock stores
  const { resetMockStores } = require("../__mocks__/zustand");
  resetMockStores();

  // Reset localStorage
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  // Reset fetch
  global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

  // Reset console methods to avoid noise
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
};

// Call this in afterEach of every test
export const cleanupTest = () => {
  jest.restoreAllMocks();
};

// ============================================================
// STORE UPDATE UTILITIES
// ============================================================

// Import the store update functions from the Zustand mock
export {
  updateChatStore,
  updateMcpStore,
  resetMockStores,
} from "../__mocks__/zustand";
