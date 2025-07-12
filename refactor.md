# 🚀 Frontend Refactoring Plan - AI Chat Application

## 📋 Project Overview
Transform the current HTML/CSS/JavaScript chat interface into a modern, scalable TypeScript-based React application for generic AI chat with MCP tool integration.

## 🎯 Current State Analysis

### What We Have:
- ✅ **Static HTML/CSS/JS** chat interface (`chat.html`)
- ✅ **Comprehensive E2E tests** (Playwright - performance, security, UX)
- ✅ **Live server setup** for development
- ✅ **Clean frontend-only architecture**

### What We Need:
- 🔄 **Modern React-based architecture**
- 🔄 **TypeScript for type safety**
- 🔄 **Component-based UI system**
- 🔄 **State management for chat and MCP features**
- 🔄 **Dedicated configuration page**

## 🛠️ Tech Stack

### **Core:**
- **Next.js 15** with App Router
- **TypeScript 5.8+**
- **React 19**

### **UI & Styling:**
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling

### **State Management:**
- **Zustand** - Chat state and MCP server management

### **Development Tools:**
- **npm** - Package manager
- **ESLint + Prettier** - Code quality
- **Playwright** - E2E testing (preserve existing)

## 📁 Project Structure

```
clebr-chat/
├── app/
│   ├── page.tsx                  # Main chat interface
│   ├── config/
│   │   └── page.tsx              # MCP server configuration page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── chat/                     # Chat components
│   │   ├── ChatInterface.tsx     # Main chat container
│   │   ├── MessageList.tsx       # Message display
│   │   ├── MessageInput.tsx      # Input handling
│   │   └── MessageBubble.tsx     # Individual messages
│   ├── mcp/                      # MCP-specific components
│   │   ├── ServerList.tsx        # Server management
│   │   ├── StatusIndicator.tsx   # Connection status
│   │   └── ConfigPanel.tsx       # Configuration UI
│   └── layout/
│       ├── Header.tsx            # App header with status
│       └── Navigation.tsx        # Page navigation
├── lib/
│   ├── stores/
│   │   ├── chatStore.ts          # Chat state management
│   │   ├── mcpStore.ts           # MCP server management
│   │   └── configStore.ts        # Configuration state
│   ├── hooks/
│   │   ├── useChat.ts            # Chat functionality
│   │   ├── useMcp.ts             # MCP integration
│   │   └── useConfig.ts          # Configuration management
│   ├── utils/
│   │   ├── api.ts                # API utilities
│   │   ├── mcp.ts                # MCP utilities
│   │   └── storage.ts            # Local storage
│   └── config/
│       └── constants.ts          # App constants
├── types/
│   ├── chat.ts                   # Chat type definitions
│   ├── mcp.ts                    # MCP type definitions
│   └── api.ts                    # API type definitions
├── tests/
│   ├── e2e/                      # Existing Playwright tests
│   └── components/               # New component tests
└── public/
```

## 🔄 Migration Strategy

### **Phase 1: Foundation (Week 1)** ✅ COMPLETED
- ✅ Initialize Next.js with TypeScript
- ✅ Set up Tailwind CSS and shadcn/ui
- ✅ Create basic project structure
- ✅ Configure ESLint/Prettier
- ✅ Fix hydration issues
- ✅ Preserve existing E2E tests

### **Phase 2: Core Features (Week 2)** ✅ COMPLETED
- ✅ **Chat Interface**: Main chat page with message handling
- ✅ **MCP Integration**: Background tool integration (preserve all current functionality)
- ✅ **State Management**: Zustand stores for chat and MCP
- ✅ **API Integration**: Maintain existing backend communication

### **Phase 3: Configuration (Week 3)** ✅ COMPLETED
- ✅ **Configuration Page**: Dedicated `/config` page for MCP server management
- ✅ **Server Management**: Add/remove servers, connection status
- ✅ **Settings**: User preferences and configuration options
- ✅ **Status Monitoring**: Real-time connection status across the app

### **Phase 4: Enhancement (Week 4)**
- [ ] **Error Handling**: Comprehensive error states and fallback modes
- [ ] **Testing**: Adapt existing Playwright tests to new architecture
- [ ] **Performance**: Optimize rendering and state updates
- [ ] **Polish**: UI improvements and accessibility

## 🎯 Key Features to Preserve

### **Chat Features:**
- [ ] Generic AI chat interface
- [ ] Message history and session management
- [ ] Loading states and error handling
- [ ] Auto-scroll and input handling

### **MCP Integration:**
- [ ] Multiple server support
- [ ] Connection status monitoring
- [ ] Fallback mode when servers fail
- [ ] Dynamic server add/remove
- [ ] Session initialization and management
- [ ] Tool integration (background)

### **Configuration:**
- [ ] Dedicated configuration page
- [ ] Server URL management
- [ ] Connection testing
- [ ] Status dashboard
- [ ] Settings persistence

## 📊 Success Metrics
- [ ] All existing E2E tests pass
- [ ] Feature parity with current implementation
- [ ] Improved developer experience with TypeScript
- [ ] Maintainable component architecture
- [ ] Responsive design across devices

---

## 🚀 Next Implementation Step: Phase 2 - Core Chat Interface

### **Priority: Main Chat Page Implementation**

**Goal**: Create the core chat interface that replicates the current `chat.html` functionality using React components.

### **Implementation Plan:**

#### **1. Type Definitions** (30 min) ✅ COMPLETED
- ✅ Create `types/chat.ts` with message interfaces
- ✅ Create `types/mcp.ts` with MCP server interfaces  
- ✅ Create `types/api.ts` with API response interfaces

#### **2. State Management Setup** (45 min) ✅ COMPLETED
- ✅ Install Zustand: `npm install zustand`
- ✅ Create `lib/stores/chatStore.ts` for message state
- [ ] Create `lib/stores/mcpStore.ts` for MCP server state
- [ ] Create `lib/stores/configStore.ts` for app configuration

#### **3. API Utilities** (30 min) ✅ COMPLETED
- ✅ Create `lib/utils/api.ts` with fetch wrappers
- [ ] Create `lib/utils/mcp.ts` with MCP-specific API calls
- [ ] Create `lib/utils/storage.ts` for localStorage management

#### **4. Core Chat Components** (2 hours) ✅ COMPLETED
- ✅ Create `components/chat/ChatInterface.tsx` - Main container
- ✅ Create `components/chat/MessageBubble.tsx` - Individual messages
- ✅ Create `components/chat/ChatInput.tsx` - Input handling

#### **5. Main Page Implementation** (1 hour) ✅ COMPLETED
- ✅ Replace `src/app/page.tsx` with chat interface
- ✅ Integrate all chat components
- ✅ Connect to state management
- ✅ Test basic message sending/receiving

#### **6. MCP Integration** (1.5 hours) ✅ COMPLETED
- ✅ Create `components/mcp/StatusIndicator.tsx`
- ✅ Create `components/mcp/ServerList.tsx`
- ✅ Integrate MCP state management
- ✅ Connect to existing backend endpoints

### **Expected Outcome:**
- Functional chat interface that matches current `chat.html` behavior
- Type-safe implementation with proper state management
- MCP server status monitoring
- Ready for configuration page implementation

### **Files to Create/Modify:**
- `types/` directory with all type definitions
- `lib/stores/` directory with Zustand stores
- `lib/utils/` directory with utility functions
- `components/chat/` directory with chat components
- `components/mcp/` directory with MCP components
- Update `src/app/page.tsx` with chat interface

### **Testing Strategy:**
- Manual testing of chat functionality
- Verify MCP server connection status
- Test message sending/receiving
- Ensure responsive design works

**Ready to proceed with this implementation plan?**
