import '@testing-library/jest-dom'
import { setupTest } from './tests/utils/test-utils'

// Global setup for all tests
setupTest();

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    usePathname() {
        return '/'
    },
    useSearchParams() {
        return new URLSearchParams()
    },
}))

// Mock API service
jest.mock('./src/lib/services/api', () => ({
    ApiService: {
        initializeMcp: jest.fn(),
        sendChatMessage: jest.fn(),
    },
}))

// Mock storage service
jest.mock('./src/lib/utils/storage', () => ({
    StorageService: {
        getMcpServers: jest.fn(() => []),
        saveMcpServers: jest.fn(),
    },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
}) 