"use client";

import { Badge } from "@/components/ui/badge";
import type { StatusIndicatorProps } from "../../types/mcp";

const statusConfig = {
  connected: {
    variant: "default" as const,
    className: "bg-green-500 hover:bg-green-600",
  },
  fallback: {
    variant: "secondary" as const,
    className: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  disconnected: {
    variant: "outline" as const,
    className: "border-gray-300 text-gray-500",
  },
  connecting: {
    variant: "secondary" as const,
    className: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  error: {
    variant: "destructive" as const,
    className: "bg-red-500 hover:bg-red-600",
  },
};

export function StatusIndicator({
  status,
  text,
  className = "",
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
