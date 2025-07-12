import React from "react";
import { render, screen, setupTest, cleanupTest } from "../utils/test-utils";
import { ServerList } from "../../components/mcp/ServerList";
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import userEvent from "@testing-library/user-event";

// Mock functions
const mockOnAddServer = jest.fn();
const mockOnRemoveServer = jest.fn();
const mockOnUpdateServerUrl = jest.fn();

// Sample server data
const mockServers = [
  {
    url: "http://localhost:3001",
    status: "connected" as const,
  },
  {
    url: "http://localhost:3002",
    status: "disconnected" as const,
  },
  {
    url: "http://localhost:3003",
    status: "error" as const,
    error: "Connection failed",
  },
];

describe("ServerList", () => {
  beforeEach(() => {
    setupTest();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanupTest();
  });

  it("renders empty state when no servers", () => {
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    expect(screen.getByText("MCP Servers")).toBeInTheDocument();
    expect(
      screen.getByText("No servers configured. Add a server to get started.")
    ).toBeInTheDocument();
  });

  it("renders server list when servers exist", () => {
    render(
      <ServerList
        servers={mockServers}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    expect(screen.getByText("MCP Servers")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("http://localhost:3001")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("http://localhost:3002")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("http://localhost:3003")
    ).toBeInTheDocument();
  });

  it("displays server status badges", () => {
    render(
      <ServerList
        servers={mockServers}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    expect(screen.getByText("connected")).toBeInTheDocument();
    expect(screen.getByText("disconnected")).toBeInTheDocument();
    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("calls onAddServer when adding new server", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter server URL (e.g., http://localhost:3000)"
    );
    const addButton = screen.getByRole("button", { name: "" }); // Plus icon button

    await user.type(input, "http://localhost:3004");
    await user.click(addButton);

    expect(mockOnAddServer).toHaveBeenCalledWith("http://localhost:3004");
  });

  it("calls onAddServer on Enter key press", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter server URL (e.g., http://localhost:3000)"
    );
    await user.type(input, "http://localhost:3004{enter}");

    expect(mockOnAddServer).toHaveBeenCalledWith("http://localhost:3004");
  });

  it("does not add empty server", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const addButton = screen.getByRole("button", { name: "" });
    await user.click(addButton);

    expect(mockOnAddServer).not.toHaveBeenCalled();
  });

  it("does not add whitespace-only server", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter server URL (e.g., http://localhost:3000)"
    );
    const addButton = screen.getByRole("button", { name: "" });

    await user.type(input, "   ");
    await user.click(addButton);

    expect(mockOnAddServer).not.toHaveBeenCalled();
  });

  it("calls onRemoveServer when removing server", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={mockServers}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const removeButtons = screen.getAllByRole("button", { name: "" }); // Trash icon buttons
    await user.click(removeButtons[1]); // Click first remove button

    expect(mockOnRemoveServer).toHaveBeenCalledWith(0);
  });

  it("calls onUpdateServerUrl when editing server URL", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={mockServers}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const inputs = screen.getAllByDisplayValue(/localhost/);

    // Just type a character to trigger the onChange event
    await user.type(inputs[0], "x");

    // onUpdateServerUrl should be called when typing
    expect(mockOnUpdateServerUrl).toHaveBeenCalled();
    expect(mockOnUpdateServerUrl).toHaveBeenCalledWith(0, expect.any(String));
  });

  it("disables add button when input is empty", () => {
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const addButton = screen.getByRole("button", { name: "" });
    expect(addButton).toBeDisabled();
  });

  it("enables add button when input has content", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter server URL (e.g., http://localhost:3000)"
    );
    const addButton = screen.getByRole("button", { name: "" });

    await user.type(input, "http://localhost:3000");
    expect(addButton).not.toBeDisabled();
  });

  it("clears input after adding server", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter server URL (e.g., http://localhost:3000)"
    );
    const addButton = screen.getByRole("button", { name: "" });

    await user.type(input, "http://localhost:3000");
    await user.click(addButton);

    expect(input).toHaveValue("");
  });

  it("trims whitespace from server URLs", async () => {
    const user = userEvent.setup();
    render(
      <ServerList
        servers={[]}
        onAddServer={mockOnAddServer}
        onRemoveServer={mockOnRemoveServer}
        onUpdateServerUrl={mockOnUpdateServerUrl}
      />
    );

    const input = screen.getByPlaceholderText(
      "Enter server URL (e.g., http://localhost:3000)"
    );
    const addButton = screen.getByRole("button", { name: "" });

    await user.type(input, "  http://localhost:3000  ");
    await user.click(addButton);

    expect(mockOnAddServer).toHaveBeenCalledWith("http://localhost:3000");
  });
});
