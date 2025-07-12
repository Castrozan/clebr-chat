"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, TestTube } from "lucide-react";
import type { ServerListProps } from "../../types/mcp";

export function ServerList({
  servers,
  onAddServer,
  onRemoveServer,
  onUpdateServerUrl,
}: ServerListProps) {
  const [newServerUrl, setNewServerUrl] = useState("");

  const handleAddServer = () => {
    if (newServerUrl.trim()) {
      onAddServer(newServerUrl.trim());
      setNewServerUrl("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddServer();
    }
  };

  const getStatusBadge = (status: string, error?: string) => {
    const config = {
      connected: { variant: "default" as const, className: "bg-green-500" },
      disconnected: {
        variant: "outline" as const,
        className: "border-gray-300",
      },
      error: { variant: "destructive" as const, className: "bg-red-500" },
    };

    const statusConfig =
      config[status as keyof typeof config] || config.disconnected;

    return (
      <Badge variant={statusConfig.variant} className={statusConfig.className}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          MCP Servers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new server */}
        <div className="flex gap-2">
          <Input
            value={newServerUrl}
            onChange={(e) => setNewServerUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter server URL (e.g., http://localhost:3000)"
            className="flex-1"
          />
          <Button onClick={handleAddServer} disabled={!newServerUrl.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Server list */}
        <div className="space-y-2">
          {servers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No servers configured. Add a server to get started.
            </p>
          ) : (
            servers.map((server, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded"
              >
                <Input
                  value={server.url}
                  onChange={(e) => onUpdateServerUrl(index, e.target.value)}
                  className="flex-1"
                />
                {getStatusBadge(server.status, server.error)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveServer(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {servers.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {servers.length} server{servers.length !== 1 ? "s" : ""} configured
          </div>
        )}
      </CardContent>
    </Card>
  );
}
