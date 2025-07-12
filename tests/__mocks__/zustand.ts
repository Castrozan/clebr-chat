import { jest } from "@jest/globals";
import { StateCreator } from "zustand";

// Global mock store registry
const mockStoreRegistry: Record<string, any> = {};

// Store identifier for each store type
const storeIdentifiers = {
  chatStore: "chatStore",
  mcpStore: "mcpStore",
};

// Create a mock create function
const create = jest.fn(<T>(stateCreator: StateCreator<T>) => {
  // Determine store type based on the state structure
  const tempState = stateCreator(
    jest.fn() as any,
    jest.fn() as any,
    {
      setState: jest.fn(),
      getState: jest.fn(),
      getInitialState: jest.fn(),
      subscribe: jest.fn(() => jest.fn()),
    } as any
  );

  // Identify store type based on properties
  let storeId = "unknownStore";
  if (tempState && typeof tempState === "object") {
    if ("sendMessage" in tempState) {
      storeId = storeIdentifiers.chatStore;
    } else if ("addServer" in tempState) {
      storeId = storeIdentifiers.mcpStore;
    }
  }

  // Mock set function
  const set = jest.fn((updater: any) => {
    if (typeof updater === "function") {
      mockStoreRegistry[storeId] = {
        ...mockStoreRegistry[storeId],
        ...updater(mockStoreRegistry[storeId]),
      };
    } else {
      mockStoreRegistry[storeId] = {
        ...mockStoreRegistry[storeId],
        ...updater,
      };
    }
  });

  // Mock get function
  const get = jest.fn(() => mockStoreRegistry[storeId]);

  // Initialize the store state if not already initialized
  if (!mockStoreRegistry[storeId]) {
    const initialState = stateCreator(set, get, {
      setState: set,
      getState: get,
      getInitialState: get,
      subscribe: jest.fn(() => jest.fn()),
    });
    mockStoreRegistry[storeId] = initialState;
  }

  // Return the mock store hook
  const useStore = jest.fn(() => mockStoreRegistry[storeId]) as any;

  // Add additional methods that might be needed
  useStore.getState = jest.fn(() => mockStoreRegistry[storeId]);
  useStore.setState = jest.fn((updater: any) => {
    if (typeof updater === "function") {
      mockStoreRegistry[storeId] = {
        ...mockStoreRegistry[storeId],
        ...updater(mockStoreRegistry[storeId]),
      };
    } else {
      mockStoreRegistry[storeId] = {
        ...mockStoreRegistry[storeId],
        ...updater,
      };
    }
  });
  useStore.subscribe = jest.fn(() => jest.fn());
  useStore.destroy = jest.fn();

  return useStore;
});

// Export functions to update store state from tests
export const updateChatStore = (updates: any) => {
  mockStoreRegistry[storeIdentifiers.chatStore] = {
    ...mockStoreRegistry[storeIdentifiers.chatStore],
    ...updates,
  };
};

export const updateMcpStore = (updates: any) => {
  mockStoreRegistry[storeIdentifiers.mcpStore] = {
    ...mockStoreRegistry[storeIdentifiers.mcpStore],
    ...updates,
  };
};

export const resetMockStores = () => {
  // Reset chat store to default state
  mockStoreRegistry[storeIdentifiers.chatStore] = {
    // Default state
    messages: [],
    isLoading: false,
    error: null,
    inputValue: "",
    // Mock actions
    addMessage: jest.fn(),
    updateMessage: jest.fn(),
    clearMessages: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setInputValue: jest.fn(),
    sendMessage: jest.fn(),
  };

  // Reset MCP store to default state
  mockStoreRegistry[storeIdentifiers.mcpStore] = {
    // Default state
    servers: [],
    sessionData: null,
    connectionStatus: "disconnected",
    statusText: "Not connected",
    isLoading: false,
    error: null,
    // Mock actions
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
  };
};

// Export the mock
export { create };
export default { create };
