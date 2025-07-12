"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { MessageBubbleProps } from "../../types/chat";

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-3 ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!message.isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>

      {message.isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
