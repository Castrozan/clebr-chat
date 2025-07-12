import { create } from "zustand";
import type { ChatStore, Message } from "../../types/chat";
import { ApiService } from "../services/api";
import { useMcpStore } from "./mcpStore";

export const useChatStore = create<ChatStore>((set, get) => ({
  // State
  messages: [],
  isLoading: false,
  error: null,
  inputValue: "",

  // Actions
  addMessage: (content: string, isUser = false) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessage: (id: string, updates: Partial<Message>) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setInputValue: (value: string) => {
    set({ inputValue: value });
  },

  sendMessage: async (content: string) => {
    const { addMessage, setLoading, setError } = get();

    // Add user message immediately
    addMessage(content, true);
    setLoading(true);
    setError(null);

    try {
      // Get session ID from MCP store
      const mcpStore = useMcpStore.getState();
      const sessionId = mcpStore.sessionData?.sessionId || "default-session";

      // Send message to backend
      const response = await ApiService.sendChatMessage({
        message: content,
        sessionId,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      addMessage(response.response, false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  },
}));
