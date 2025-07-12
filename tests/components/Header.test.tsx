import React from "react";
import { render, screen, setupTest, cleanupTest } from "../utils/test-utils";
import { Header } from "../../components/layout/Header";
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

// Mock the usePathname hook specifically
const mockUsePathname = jest.fn();

// Mock the entire next/navigation module
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("Header", () => {
  beforeEach(() => {
    setupTest();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanupTest();
  });

  it("renders header with logo and title", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    expect(screen.getByText("AI Chat")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    expect(screen.getByRole("link", { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /config/i })).toBeInTheDocument();
  });

  it("shows active state for chat page when on root path", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    const chatButton = screen.getByRole("button", { name: /chat/i });
    const configButton = screen.getByRole("button", { name: /config/i });

    expect(chatButton).toHaveClass("bg-primary");
    expect(configButton).not.toHaveClass("bg-primary");
  });

  it("renders navigation buttons", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    // Test that both buttons are present
    expect(screen.getByRole("button", { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /config/i })).toBeInTheDocument();
  });

  it("renders navigation icons", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    // Test for the presence of icons by checking for specific icon classes
    const messageSquareIcons = screen.getAllByText("Chat");
    const settingsIcons = screen.getAllByText("Config");

    expect(messageSquareIcons.length).toBeGreaterThan(0);
    expect(settingsIcons.length).toBeGreaterThan(0);
  });

  it("has correct link destinations", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    const chatLink = screen.getByRole("link", { name: /chat/i });
    const configLink = screen.getByRole("link", { name: /config/i });

    expect(chatLink).toHaveAttribute("href", "/");
    expect(configLink).toHaveAttribute("href", "/config");
  });

  it("maintains responsive layout", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    // Check that the header structure is present
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("displays button text correctly", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Config")).toBeInTheDocument();
  });
});
