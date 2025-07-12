import React from "react";
import { render, screen } from "../utils/test-utils";
import { MessageBubble } from "../../src/components/chat/MessageBubble";
import type { Message } from "../../src/types/chat";
import { describe, it, expect } from "@jest/globals";

describe("MessageBubble", () => {
  const mockUserMessage: Message = {
    id: "1",
    content: "Hello, world!",
    isUser: true,
    timestamp: new Date("2024-01-01T12:00:00Z"),
  };

  const mockAiMessage: Message = {
    id: "2",
    content: "Hi there! How can I help you?",
    isUser: false,
    timestamp: new Date("2024-01-01T12:01:00Z"),
  };

  it("renders user message correctly", () => {
    render(<MessageBubble message={mockUserMessage} />);

    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText(/\d{1,2}:\d{2}:\d{2} (AM|PM)/)).toBeInTheDocument();
  });

  it("renders AI message correctly", () => {
    render(<MessageBubble message={mockAiMessage} />);

    expect(
      screen.getByText("Hi there! How can I help you?")
    ).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText(/\d{1,2}:\d{2}:\d{2} (AM|PM)/)).toBeInTheDocument();
  });

  it("applies correct styling for user message", () => {
    render(<MessageBubble message={mockUserMessage} />);

    const messageContainer = screen.getByText("Hello, world!").closest("div");
    expect(messageContainer).toHaveClass(
      "bg-primary",
      "text-primary-foreground"
    );
  });

  it("applies correct styling for AI message", () => {
    render(<MessageBubble message={mockAiMessage} />);

    const messageContainer = screen
      .getByText("Hi there! How can I help you?")
      .closest("div");
    expect(messageContainer).toHaveClass("bg-muted");
  });

  it("shows user avatar on the right for user messages", () => {
    render(<MessageBubble message={mockUserMessage} />);

    // The outermost container has the alignment class
    const outerContainer = screen
      .getByText("Hello, world!")
      .closest("div")?.parentElement;
    expect(outerContainer).toHaveClass("justify-end");
  });

  it("shows AI avatar on the left for AI messages", () => {
    render(<MessageBubble message={mockAiMessage} />);

    const outerContainer = screen
      .getByText("Hi there! How can I help you?")
      .closest("div")?.parentElement;
    expect(outerContainer).toHaveClass("justify-start");
  });

  it("displays timestamp correctly", () => {
    render(<MessageBubble message={mockUserMessage} />);

    expect(screen.getByText(/\d{1,2}:\d{2}:\d{2} (AM|PM)/)).toBeInTheDocument();
  });
});
