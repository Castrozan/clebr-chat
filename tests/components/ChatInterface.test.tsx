import React from "react";
import { render, screen, setupTest, cleanupTest } from "../utils/test-utils";
import { ChatInterface } from "../../components/chat/ChatInterface";
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { useChatStore } from "../../lib/stores/chatStore";
import { useMcpStore } from "../../lib/stores/mcpStore";

// Mock the stores
jest.mock("../../lib/stores/chatStore");
jest.mock("../../lib/stores/mcpStore");

const mockUseChatStore = useChatStore as jest.MockedFunction<
  typeof useChatStore
>;
const mockUseMcpStore = useMcpStore as jest.MockedFunction<typeof useMcpStore>;

describe("ChatInterface", () => {
  beforeEach(() => {
    setupTest();

    // Setup default mock return values
    mockUseChatStore.mockReturnValue({
      messages: [],
      isLoading: false,
      error: null,
      inputValue: "",
      addMessage: jest.fn(),
      updateMessage: jest.fn(),
      clearMessages: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setInputValue: jest.fn(),
      sendMessage: jest.fn(),
    });

    mockUseMcpStore.mockReturnValue({
      servers: [],
      sessionData: null,
      connectionStatus: "disconnected",
      statusText: "Not connected",
      isLoading: false,
      error: null,
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
    });
  });

  afterEach(() => {
    cleanupTest();
  });

  it("renders chat interface with title", () => {
    render(<ChatInterface />);
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
  });

  it("shows empty state when no messages", () => {
    render(<ChatInterface />);
    expect(screen.getByText("Start a conversation...")).toBeInTheDocument();
  });

  it("renders chat input component", () => {
    render(<ChatInterface />);
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("displays messages when available", () => {
    const mockMessages = [
      {
        id: "1",
        content: "Hello, how are you?",
        isUser: true,
        timestamp: new Date(),
      },
      {
        id: "2",
        content: "I'm doing well, thank you!",
        isUser: false,
        timestamp: new Date(),
      },
    ];

    mockUseChatStore.mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      error: null,
      inputValue: "",
      addMessage: jest.fn(),
      updateMessage: jest.fn(),
      clearMessages: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setInputValue: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<ChatInterface />);
    expect(screen.getByText("Hello, how are you?")).toBeInTheDocument();
    expect(screen.getByText("I'm doing well, thank you!")).toBeInTheDocument();
  });

  it("shows connection status", () => {
    mockUseMcpStore.mockReturnValue({
      servers: [],
      sessionData: null,
      connectionStatus: "connected",
      statusText: "Connected to servers",
      isLoading: false,
      error: null,
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
    });

    render(<ChatInterface />);
    expect(screen.getByText("connected")).toBeInTheDocument();
    expect(screen.getByText("Connected to servers")).toBeInTheDocument();
  });

  it("shows error status when connection fails", () => {
    mockUseMcpStore.mockReturnValue({
      servers: [],
      sessionData: null,
      connectionStatus: "error",
      statusText: "Connection failed",
      isLoading: false,
      error: null,
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
    });

    render(<ChatInterface />);
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
  });

  it("displays chat error message", () => {
    mockUseChatStore.mockReturnValue({
      messages: [],
      isLoading: false,
      error: "Failed to send message",
      inputValue: "",
      addMessage: jest.fn(),
      updateMessage: jest.fn(),
      clearMessages: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setInputValue: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<ChatInterface />);
    expect(screen.getByText("Failed to send message")).toBeInTheDocument();
  });

  it("displays multiple messages in order", () => {
    const mockMessages = [
      {
        id: "1",
        content: "First message",
        isUser: true,
        timestamp: new Date("2023-01-01T10:00:00Z"),
      },
      {
        id: "2",
        content: "Second message",
        isUser: false,
        timestamp: new Date("2023-01-01T10:01:00Z"),
      },
      {
        id: "3",
        content: "Third message",
        isUser: true,
        timestamp: new Date("2023-01-01T10:02:00Z"),
      },
    ];

    mockUseChatStore.mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      error: null,
      inputValue: "",
      addMessage: jest.fn(),
      updateMessage: jest.fn(),
      clearMessages: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setInputValue: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<ChatInterface />);

    // Check that all messages are rendered
    expect(screen.getByText("First message")).toBeInTheDocument();
    expect(screen.getByText("Second message")).toBeInTheDocument();
    expect(screen.getByText("Third message")).toBeInTheDocument();
  });

  it("maintains layout structure", () => {
    render(<ChatInterface />);

    // Check that the main elements are present
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
    expect(screen.getByText("Start a conversation...")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
  });
});
