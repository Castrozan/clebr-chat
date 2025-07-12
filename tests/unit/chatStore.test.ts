/**
 * @jest-environment jsdom
 */

import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

// Mock the external dependencies that the store uses
const mockApiService = {
  sendChatMessage: jest.fn<() => Promise<any>>(),
};

const mockMcpStore = {
  getState: jest.fn(() => ({
    sessionData: { sessionId: "test-session" },
  })),
};

// Mock modules before importing the store
jest.mock("../../src/lib/services/api", () => ({
  ApiService: mockApiService,
}));

jest.mock("../../src/lib/stores/mcpStore", () => ({
  useMcpStore: mockMcpStore,
}));

// Unmock Zustand to use the real implementation
jest.unmock("zustand");

// Import the actual store implementation
const { useChatStore } = jest.requireActual(
  "../../src/lib/stores/chatStore"
) as typeof import("../../src/lib/stores/chatStore");

describe("ChatStore", () => {
  beforeEach(() => {
    // Reset the store to initial state
    useChatStore.setState({
      messages: [],
      isLoading: false,
      error: null,
      inputValue: "",
    });
    jest.clearAllMocks();
  });

  describe("State Management", () => {
    it("has correct initial state", () => {
      const state = useChatStore.getState();

      expect(state.messages).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.inputValue).toBe("");
    });

    it("adds message correctly", () => {
      const { addMessage } = useChatStore.getState();

      addMessage("Hello, world!", true);

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].content).toBe("Hello, world!");
      expect(state.messages[0].isUser).toBe(true);
      expect(state.messages[0].id).toBeDefined();
      expect(state.messages[0].timestamp).toBeInstanceOf(Date);
    });

    it("adds AI message correctly", () => {
      const { addMessage } = useChatStore.getState();

      addMessage("I'm an AI assistant", false);

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].content).toBe("I'm an AI assistant");
      expect(state.messages[0].isUser).toBe(false);
    });

    it("updates message correctly", () => {
      const { addMessage, updateMessage } = useChatStore.getState();

      addMessage("Original message", true);
      const state = useChatStore.getState();
      const messageId = state.messages[0].id;

      updateMessage(messageId, { content: "Updated message" });

      const updatedState = useChatStore.getState();
      expect(updatedState.messages[0].content).toBe("Updated message");
    });

    it("clears messages correctly", () => {
      const { addMessage, clearMessages } = useChatStore.getState();

      addMessage("Message 1", true);
      addMessage("Message 2", false);

      clearMessages();

      const state = useChatStore.getState();
      expect(state.messages).toEqual([]);
    });

    it("sets loading state correctly", () => {
      const { setLoading } = useChatStore.getState();

      setLoading(true);
      expect(useChatStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useChatStore.getState().isLoading).toBe(false);
    });

    it("sets error state correctly", () => {
      const { setError } = useChatStore.getState();

      setError("Test error");
      expect(useChatStore.getState().error).toBe("Test error");

      setError(null);
      expect(useChatStore.getState().error).toBe(null);
    });

    it("sets input value correctly", () => {
      const { setInputValue } = useChatStore.getState();

      setInputValue("Test input");
      expect(useChatStore.getState().inputValue).toBe("Test input");
    });
  });

  describe("Message Operations", () => {
    it("adds multiple messages in order", () => {
      const { addMessage } = useChatStore.getState();

      addMessage("First message", true);
      addMessage("Second message", false);
      addMessage("Third message", true);

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(3);
      expect(state.messages[0].content).toBe("First message");
      expect(state.messages[1].content).toBe("Second message");
      expect(state.messages[2].content).toBe("Third message");
    });

    it("generates unique message IDs", () => {
      const { addMessage } = useChatStore.getState();

      addMessage("Message 1", true);
      // Add a small delay to ensure different timestamps
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 1);
      addMessage("Message 2", true);
      Date.now = originalDateNow;

      const state = useChatStore.getState();
      expect(state.messages[0].id).not.toBe(state.messages[1].id);
    });

    it("updates only specified message", () => {
      const { addMessage, updateMessage } = useChatStore.getState();

      addMessage("Message 1", true);
      // Ensure different timestamp for second message
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 1);
      addMessage("Message 2", true);
      Date.now = originalDateNow;

      const state = useChatStore.getState();
      const firstMessageId = state.messages[0].id;
      const secondMessageId = state.messages[1].id;

      // Update the first message
      updateMessage(firstMessageId, { content: "Updated" });

      const updatedState = useChatStore.getState();
      expect(updatedState.messages[0].content).toBe("Updated");
      expect(updatedState.messages[1].content).toBe("Message 2");

      // Verify IDs are still different
      expect(firstMessageId).not.toBe(secondMessageId);
    });

    it("handles partial message updates", () => {
      const { addMessage, updateMessage } = useChatStore.getState();

      addMessage("Original message", true);
      const state = useChatStore.getState();
      const messageId = state.messages[0].id;

      updateMessage(messageId, { isLoading: true });

      const updatedState = useChatStore.getState();
      expect(updatedState.messages[0].content).toBe("Original message");
      expect(updatedState.messages[0].isLoading).toBe(true);
    });
  });

  describe("Async Operations", () => {
    it("handles sendMessage flow correctly", async () => {
      mockApiService.sendChatMessage.mockResolvedValueOnce({
        response: "AI response",
        error: null,
      });

      const { sendMessage } = useChatStore.getState();

      await sendMessage("User message");

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(2);
      expect(state.messages[0].content).toBe("User message");
      expect(state.messages[0].isUser).toBe(true);
      expect(state.messages[1].content).toBe("AI response");
      expect(state.messages[1].isUser).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it("handles API errors correctly", async () => {
      mockApiService.sendChatMessage.mockRejectedValueOnce(
        new Error("API Error")
      );

      const { sendMessage } = useChatStore.getState();

      await sendMessage("User message");

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(1); // Only user message
      expect(state.messages[0].content).toBe("User message");
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("API Error");
    });

    it("handles API response with error field", async () => {
      mockApiService.sendChatMessage.mockResolvedValueOnce({
        response: null,
        error: "Failed to process",
      });

      const { sendMessage } = useChatStore.getState();

      await sendMessage("User message");

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(1); // Only user message
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Failed to process");
    });

    it("sets loading state during API call", async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockApiService.sendChatMessage.mockReturnValueOnce(promise);

      const { sendMessage } = useChatStore.getState();

      // Start the async operation
      const sendPromise = sendMessage("User message");

      // Check loading state
      expect(useChatStore.getState().isLoading).toBe(true);

      // Resolve the promise
      resolvePromise!({ response: "AI response", error: null });
      await sendPromise;

      // Check final state
      expect(useChatStore.getState().isLoading).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("clears error when starting new message", async () => {
      const { setError, sendMessage } = useChatStore.getState();

      // Set an error first
      setError("Previous error");
      expect(useChatStore.getState().error).toBe("Previous error");

      // Mock successful API call
      mockApiService.sendChatMessage.mockResolvedValueOnce({
        response: "AI response",
        error: null,
      });

      // Send a new message
      await sendMessage("User message");

      expect(useChatStore.getState().error).toBe(null);
    });

    it("handles non-Error exceptions", async () => {
      mockApiService.sendChatMessage.mockRejectedValueOnce("String error");

      const { sendMessage } = useChatStore.getState();

      await sendMessage("User message");

      expect(useChatStore.getState().error).toBe("Failed to send message");
    });
  });
});
