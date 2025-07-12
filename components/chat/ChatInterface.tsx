"use client";

import { useChatStore } from "../../lib/stores/chatStore";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChatInterface() {
  const { messages, error } = useChatStore();

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Start a conversation...
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Input Area */}
        <ChatInput />
      </CardContent>
    </Card>
  );
}
