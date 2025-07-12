// Local storage utilities for MCP configuration persistence

const STORAGE_KEYS = {
  MCP_SERVERS: "mcp_servers",
  MCP_SESSION: "mcp_session",
} as const;

export interface StoredMcpServer {
  url: string;
  status: "connected" | "disconnected" | "error" | "connecting";
  error?: string;
  lastConnected?: string; // ISO date string
}

export interface StoredMcpSession {
  sessionId: string;
  success: boolean;
  fallbackMode?: boolean;
  error?: string;
  timestamp: string; // ISO date string
}

export class StorageService {
  // MCP Servers
  static getMcpServers(): StoredMcpServer[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCP_SERVERS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load MCP servers from storage:", error);
      return [];
    }
  }

  static saveMcpServers(servers: StoredMcpServer[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.MCP_SERVERS, JSON.stringify(servers));
    } catch (error) {
      console.error("Failed to save MCP servers to storage:", error);
    }
  }

  // MCP Session
  static getMcpSession(): StoredMcpSession | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCP_SESSION);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to load MCP session from storage:", error);
      return null;
    }
  }

  static saveMcpSession(session: StoredMcpSession): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.MCP_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error("Failed to save MCP session to storage:", error);
    }
  }

  static clearMcpSession(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STORAGE_KEYS.MCP_SESSION);
    } catch (error) {
      console.error("Failed to clear MCP session from storage:", error);
    }
  }

  // Clear all MCP data
  static clearAllMcpData(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STORAGE_KEYS.MCP_SERVERS);
      localStorage.removeItem(STORAGE_KEYS.MCP_SESSION);
    } catch (error) {
      console.error("Failed to clear MCP data from storage:", error);
    }
  }
}
