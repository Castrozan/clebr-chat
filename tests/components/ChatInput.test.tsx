import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import { ChatInput } from "../../src/components/chat/ChatInput";
import { describe, it, expect, beforeEach } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { resetAllMocks, updateChatStore } from "../utils/test-utils";

describe("ChatInput", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("renders input and send button", () => {
    render(<ChatInput />);

    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("handles input changes", async () => {
    const user = userEvent.setup();
    render(<ChatInput />);

    const input = screen.getByPlaceholderText("Type your message...");
    await user.type(input, "Hello, world!");

    expect(input).toHaveValue("Hello, world!");
  });

  it("submits form with message", async () => {
    const mockSendMessage = jest.fn();
    updateChatStore({ sendMessage: mockSendMessage });

    const user = userEvent.setup();
    render(<ChatInput />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: "Send" });

    await user.type(input, "Test message");
    await user.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith("Test message");
  });

  it("submits form on Enter key", async () => {
    const mockSendMessage = jest.fn();
    updateChatStore({ sendMessage: mockSendMessage });

    const user = userEvent.setup();
    render(<ChatInput />);

    const input = screen.getByPlaceholderText("Type your message...");

    await user.type(input, "Test message");
    await user.keyboard("{Enter}");

    expect(mockSendMessage).toHaveBeenCalledWith("Test message");
  });

  it("does not submit empty messages", async () => {
    const mockSendMessage = jest.fn();
    updateChatStore({ sendMessage: mockSendMessage });

    const user = userEvent.setup();
    render(<ChatInput />);

    const sendButton = screen.getByRole("button", { name: "Send" });
    await user.click(sendButton);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("does not submit whitespace-only messages", async () => {
    const mockSendMessage = jest.fn();
    updateChatStore({ sendMessage: mockSendMessage });

    const user = userEvent.setup();
    render(<ChatInput />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: "Send" });

    await user.type(input, "   ");
    await user.click(sendButton);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("disables input and button when loading", () => {
    updateChatStore({ isLoading: true });

    render(<ChatInput />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: "Sending..." });

    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it("shows loading state in button text", () => {
    updateChatStore({ isLoading: true });

    render(<ChatInput />);

    expect(
      screen.getByRole("button", { name: "Sending..." })
    ).toBeInTheDocument();
  });

  it("does not submit when loading", async () => {
    const mockSendMessage = jest.fn();
    updateChatStore({
      isLoading: true,
      sendMessage: mockSendMessage,
    });

    const user = userEvent.setup();
    render(<ChatInput />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: "Sending..." });

    await user.type(input, "Test message");
    await user.click(sendButton);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("trims whitespace from messages", async () => {
    const mockSendMessage = jest.fn();
    updateChatStore({ sendMessage: mockSendMessage, isLoading: false });

    const user = userEvent.setup();
    render(<ChatInput />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: "Send" });

    await user.type(input, "  Test message  ");
    await user.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith("Test message");
  });
});
