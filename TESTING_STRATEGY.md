# Testing Strategy & Patterns

## Overview

This document outlines the testing strategy, patterns, and best practices for the clebr-chat project. The testing approach emphasizes simplicity, consistency, and maintainability while providing comprehensive coverage.

## Testing Philosophy

### 1. **Simplicity First**
- Tests should be easy to read and understand
- Avoid complex test setups and configurations
- Use clear, descriptive test names
- Focus on testing behavior, not implementation details

### 2. **Consistent Patterns**
- Use standardized testing utilities across all tests
- Follow the same structure and naming conventions
- Maintain consistent mocking strategies
- Apply uniform setup and teardown patterns

### 3. **Maintainable Tests**
- Tests should be resilient to refactoring
- Mock external dependencies consistently
- Use test utilities to reduce duplication
- Write tests that fail clearly when something breaks

## Test Structure

### File Organization
```
tests/
├── components/          # React component tests
├── unit/               # Unit tests for stores, services, utils
├── utils/              # Testing utilities and helpers
└── __mocks__/          # Mock implementations
```

### Test Categories

#### 1. **Component Tests** (`tests/components/`)
- Test React components in isolation
- Focus on user interactions and rendering
- Mock store dependencies
- Test accessibility and responsive behavior

#### 2. **Unit Tests** (`tests/unit/`)
- Test individual functions and classes
- Test store logic and state management
- Test service layer functionality
- Test utility functions

#### 3. **Integration Tests** (Future)
- Test component integration with stores
- Test API integration
- Test end-to-end workflows

## Testing Utilities

### Core Utilities (`tests/utils/test-utils.tsx`)

#### Setup and Teardown
```typescript
// Use in every test file
beforeEach(() => {
  setupTest();
});

afterEach(() => {
  cleanupTest();
});
```

#### Mock Factories
```typescript
// Create consistent mock data
const mockMessage = createMockMessage({
  content: "Test message",
  isUser: true
});

const mockServer = createMockServer({
  url: "http://localhost:3001",
  status: "connected"
});
```

#### Store Mocking
```typescript
// Mock store returns
const mockChatStore = createMockChatStore({
  messages: [mockMessage],
  isLoading: false
});
```

## Component Testing Patterns

### Basic Component Test Structure

```typescript
import React from "react";
import { render, screen, setupTest, cleanupTest } from "../utils/test-utils";
import { ComponentName } from "../../path/to/component";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";

describe("ComponentName", () => {
  beforeEach(() => {
    setupTest();
  });

  afterEach(() => {
    cleanupTest();
  });

  it("renders correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("handles user interactions", async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    await user.click(screen.getByRole("button"));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### Store Mocking in Components

```typescript
// Mock the stores
jest.mock("../../lib/stores/chatStore");
jest.mock("../../lib/stores/mcpStore");

const mockUseChatStore = useChatStore as jest.MockedFunction<typeof useChatStore>;
const mockUseMcpStore = useMcpStore as jest.MockedFunction<typeof useMcpStore>;

beforeEach(() => {
  setupTest();
  
  mockUseChatStore.mockReturnValue({
    messages: [],
    isLoading: false,
    // ... other properties
  });
});
```

## Store Testing Patterns

### Zustand Store Testing

```typescript
import { useChatStore } from "../../lib/stores/chatStore";

describe("ChatStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useChatStore.setState({
      messages: [],
      isLoading: false,
      error: null,
      // ... other initial state
    });
    jest.clearAllMocks();
  });

  it("updates state correctly", () => {
    const { addMessage } = useChatStore.getState();
    
    addMessage("Test message", true);
    
    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].content).toBe("Test message");
  });
});
```

## Mocking Strategies

### 1. **External Dependencies**
```typescript
// Mock API services
jest.mock("../../lib/services/api", () => ({
  ApiService: {
    sendMessage: jest.fn(),
    initializeMcp: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
    // ... other router methods
  }),
}));
```

### 2. **Zustand Stores**
```typescript
// Mock store modules
jest.mock("../../lib/stores/chatStore");
jest.mock("../../lib/stores/mcpStore");

// Type the mocked functions
const mockUseChatStore = useChatStore as jest.MockedFunction<typeof useChatStore>;
```

### 3. **Date/Time Mocking**
```typescript
// Handle timing-sensitive tests
const originalDateNow = Date.now;
Date.now = jest.fn(() => originalDateNow() + 1);
// ... test code
Date.now = originalDateNow;
```

## Best Practices

### 1. **Test Naming**
- Use descriptive test names that explain the behavior
- Follow the pattern: "should [expected behavior] when [condition]"
- Use `describe` blocks to group related tests

### 2. **Assertions**
- Use specific assertions (e.g., `toHaveLength()` instead of `toBeTruthy()`)
- Test both positive and negative cases
- Verify side effects (function calls, state changes)

### 3. **Test Data**
- Use factory functions for creating test data
- Keep test data minimal and focused
- Use realistic data that matches production scenarios

### 4. **Async Testing**
- Use `async/await` for asynchronous operations
- Wait for UI updates with `await user.click()`
- Test loading states and error conditions

### 5. **Accessibility Testing**
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test keyboard navigation
- Verify ARIA attributes when relevant

## Configuration

### Jest Configuration (`jest.config.cjs`)
- Uses Next.js Jest configuration
- Includes custom module mapping
- Sets up jsdom environment
- Configures coverage thresholds

### Setup File (`jest.setup.js`)
- Imports testing library matchers
- Sets up global mocks
- Configures test environment

## Common Pitfalls and Solutions

### 1. **Timing Issues**
- Use `await` for user interactions
- Mock time-dependent functions
- Use `waitFor` for async state updates

### 2. **State Leakage**
- Always reset store state in `beforeEach`
- Use `cleanupTest()` in `afterEach`
- Clear all mocks between tests

### 3. **Mock Conflicts**
- Avoid mocking the same module in multiple places
- Use global mocks in setup file for common dependencies
- Be explicit about mock return values

## Coverage Goals

### Target Coverage
- **Lines**: 70% minimum
- **Functions**: 70% minimum
- **Branches**: 70% minimum
- **Statements**: 70% minimum

### Coverage Focus
- Prioritize business logic and user interactions
- Ensure error handling is covered
- Test edge cases and boundary conditions

## Testing Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPatterns=ComponentName.test.tsx

# Run tests with coverage
npm test:coverage

# Run tests in watch mode
npm test:watch

# Run unit tests only
npm test:unit

# Run component tests only
npm test:components
```

## Future Improvements

1. **Integration Tests**: Add tests that verify component-store integration
2. **Visual Regression Tests**: Add screenshot-based testing for UI consistency
3. **Performance Tests**: Add tests for performance-critical components
4. **Accessibility Tests**: Expand accessibility testing coverage
5. **E2E Tests**: Enhance end-to-end testing with Playwright

## Conclusion

This testing strategy provides a solid foundation for maintaining code quality and preventing regressions. By following these patterns and practices, the test suite will remain maintainable, reliable, and valuable for the development process.

The key is consistency: use the same patterns across all tests, maintain clear documentation, and continuously improve the testing approach based on team feedback and lessons learned. 