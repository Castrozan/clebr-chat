// MCP Server types
export interface McpServer {
  url: string;
  status: "connected" | "disconnected" | "error" | "connecting";
  error?: string;
  lastConnected?: Date;
}

// MCP Tool types
export interface McpTool {
  name: string;
  description?: string;
  parameters?: Record<string, any>;
}

// MCP Session data
export interface McpSessionData {
  sessionId: string;
  success: boolean;
  fallbackMode?: boolean;
  error?: string;
  servers?: McpServer[];
  tools?: McpTool[];
}

// MCP Connection status
export type ConnectionStatus =
  | "connected"
  | "fallback"
  | "disconnected"
  | "connecting"
  | "error";

// MCP State interface
export interface McpState {
  servers: McpServer[];
  sessionData: McpSessionData | null;
  connectionStatus: ConnectionStatus;
  statusText: string;
  isLoading: boolean;
  error: string | null;
}

// MCP Actions
export interface McpActions {
  addServer: (url: string) => void;
  removeServer: (index: number) => void;
  updateServerUrl: (index: number, url: string) => void;
  updateServerStatus: (
    url: string,
    status: McpServer["status"],
    error?: string
  ) => void;
  setConnectionStatus: (status: ConnectionStatus, text?: string) => void;
  setSessionData: (data: McpSessionData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeMcp: (serverUrls: string[]) => Promise<void>;
  testServerConnection: (url: string) => Promise<boolean>;
}

// Combined MCP store type
export type McpStore = McpState & McpActions;

// Status indicator props
export interface StatusIndicatorProps {
  status: ConnectionStatus;
  text: string;
  className?: string;
}

// Server list props
export interface ServerListProps {
  servers: McpServer[];
  onAddServer: (url: string) => void;
  onRemoveServer: (index: number) => void;
  onUpdateServerUrl: (index: number, url: string) => void;
  className?: string;
}

// Server item props
export interface ServerItemProps {
  server: McpServer;
  index: number;
  canRemove: boolean;
  onRemove: (index: number) => void;
  onUpdateUrl: (index: number, url: string) => void;
  className?: string;
}

// Configuration panel props
export interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}
