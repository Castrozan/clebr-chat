"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "../../components/mcp/StatusIndicator";
import { ServerList } from "../../components/mcp/ServerList";
import { useMcpStore } from "../../lib/stores/mcpStore";
import { Settings, RefreshCw, AlertCircle } from "lucide-react";

export default function ConfigPage() {
  const {
    servers,
    connectionStatus,
    statusText,
    isLoading,
    error,
    addServer,
    removeServer,
    updateServerUrl,
    initializeMcp,
  } = useMcpStore();

  // Add default server if none exist
  useEffect(() => {
    if (servers.length === 0) {
      addServer("http://localhost:3001/mcp");
    }
  }, [servers.length, addServer]);

  const handleInitialize = async () => {
    const serverUrls = servers.map((server) => server.url);
    await initializeMcp(serverUrls);
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <main className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Settings className="h-8 w-8" />
            Configuration
          </h1>
          <p className="text-muted-foreground">
            Manage MCP servers and connection settings
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusIndicator status={connectionStatus} text={statusText} />

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleInitialize}
                disabled={isLoading || servers.length === 0}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading ? "Connecting..." : "Connect to Servers"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Server Management */}
        <ServerList
          servers={servers}
          onAddServer={addServer}
          onRemoveServer={removeServer}
          onUpdateServerUrl={updateServerUrl}
        />

        {/* Session Info */}
        {servers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Configured servers: {servers.length}</p>
                <p>Status: {connectionStatus}</p>
                <p>Last update: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
