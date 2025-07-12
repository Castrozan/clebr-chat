import { ChatInterface } from "../../components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Chat</h1>
          <p className="text-muted-foreground">
            Chat with AI using MCP tool integration
          </p>
        </div>

        <ChatInterface />
      </main>
    </div>
  );
}
