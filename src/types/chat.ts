// Chat message types
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

// Chat state interface
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  inputValue: string;
}

// Chat actions
export interface ChatActions {
  addMessage: (content: string, isUser?: boolean) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInputValue: (value: string) => void;
  sendMessage: (content: string) => Promise<void>;
}

// Combined chat store type
export type ChatStore = ChatState & ChatActions;

// Message bubble props
export interface MessageBubbleProps {
  message: Message;
  className?: string;
}

// Message list props
export interface MessageListProps {
  messages: Message[];
  className?: string;
}

// Message input props
export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// Chat interface props
export interface ChatInterfaceProps {
  className?: string;
}
