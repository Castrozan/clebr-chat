"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "../../lib/stores/chatStore";

export function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, isLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={!inputValue.trim() || isLoading}>
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
