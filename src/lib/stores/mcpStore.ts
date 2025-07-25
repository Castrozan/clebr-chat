import { create } from "zustand";
import type {
  McpState,
  McpActions,
  McpServer,
  ConnectionStatus,
} from "../../types/mcp";
import { ApiService } from "../services/api";

export const useMcpStore = create<McpState & McpActions>((set, get) => ({
  // State - Initialize with empty state to avoid hydration mismatch
  servers: [],
  sessionData: null,
  connectionStatus: "disconnected",
  statusText: "Not connected",
  isLoading: false,
  error: null,

  // Actions
  addServer: (url: string) => {
    const newServer: McpServer = {
      url,
      status: "disconnected",
    };

    set((state) => ({
      servers: [...state.servers, newServer],
    }));
  },

  removeServer: (index: number) => {
    set((state) => ({
      servers: state.servers.filter((_, i) => i !== index),
    }));
  },

  updateServerUrl: (index: number, url: string) => {
    set((state) => ({
      servers: state.servers.map((server, i) =>
        i === index ? { ...server, url } : server
      ),
    }));
  },

  updateServerStatus: (
    url: string,
    status: McpServer["status"],
    error?: string
  ) => {
    set((state) => ({
      servers: state.servers.map((server) =>
        server.url === url ? { ...server, status, error } : server
      ),
    }));
  },

  setConnectionStatus: (status: ConnectionStatus, text?: string) => {
    set({
      connectionStatus: status,
      statusText: text || status,
    });
  },

  setSessionData: (sessionData) => {
    set({ sessionData });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  initializeMcp: async (serverUrls: string[]) => {
    const {
      setLoading,
      setError,
      setConnectionStatus,
      setSessionData,
      updateServerStatus,
    } = get();

    setLoading(true);
    setError(null);
    setConnectionStatus("connecting", "Initializing MCP servers...");

    try {
      const response = await ApiService.initializeMcp({
        mcpServerUrls: serverUrls,
      });

      setSessionData(response);

      if (response.success) {
        setConnectionStatus("connected", "Connected to MCP servers");

        // Update server statuses
        if (response.servers) {
          response.servers.forEach((server) => {
            updateServerStatus(server.url, server.status, server.error);
          });
        }
      } else if (response.fallbackMode) {
        setConnectionStatus("fallback", "Running in fallback mode");
      } else {
        setConnectionStatus("error", response.error || "Failed to connect");
        setError(response.error || "Failed to initialize MCP servers");
      }
    } catch (error) {
      setConnectionStatus("error", "Connection failed");
      setError(
        error instanceof Error ? error.message : "Failed to initialize MCP"
      );
    } finally {
      setLoading(false);
    }
  },

  testServerConnection: async (url: string) => {
    const { updateServerStatus } = get();

    updateServerStatus(url, "connecting");

    try {
      // Test with a single server
      const response = await ApiService.initializeMcp({ mcpServerUrls: [url] });

      if (response.success) {
        updateServerStatus(url, "connected");
        return true;
      } else {
        updateServerStatus(url, "error", response.error);
        return false;
      }
    } catch (error) {
      updateServerStatus(
        url,
        "error",
        error instanceof Error ? error.message : "Connection failed"
      );
      return false;
    }
  },
}));
