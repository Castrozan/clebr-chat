import React from "react";
import { render, screen } from "../utils/test-utils";
import { StatusIndicator } from "../../src/components/mcp/StatusIndicator";
import { describe, it, expect } from "@jest/globals";

describe("StatusIndicator", () => {
  it("renders connected status correctly", () => {
    render(<StatusIndicator status="connected" text="Connected to servers" />);

    expect(screen.getByText("connected")).toBeInTheDocument();
    expect(screen.getByText("Connected to servers")).toBeInTheDocument();
  });

  it("renders disconnected status correctly", () => {
    render(<StatusIndicator status="disconnected" text="Not connected" />);

    expect(screen.getByText("disconnected")).toBeInTheDocument();
    expect(screen.getByText("Not connected")).toBeInTheDocument();
  });

  it("renders error status correctly", () => {
    render(<StatusIndicator status="error" text="Connection failed" />);

    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <StatusIndicator
        status="connected"
        text="Connected"
        className="custom-class"
      />
    );

    const container = screen.getByText("connected").closest("div");
    expect(container).toHaveClass("custom-class");
  });
});
