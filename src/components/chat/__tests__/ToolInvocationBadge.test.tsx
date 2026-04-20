import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeToolInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result",
  result?: unknown
): ToolInvocation {
  const base = { toolCallId: "test-id", toolName, args };
  if (state === "result") {
    return { ...base, state, result } as ToolInvocation;
  }
  return { ...base, state } as ToolInvocation;
}

test("shows 'Creating <file>' for str_replace_editor create command", () => {
  const tool = makeToolInvocation(
    "str_replace_editor",
    { command: "create", path: "src/components/App.tsx" },
    "result",
    "Success"
  );
  render(<ToolInvocationBadge tool={tool} />);
  expect(screen.getByText("Creating App.tsx")).toBeDefined();
});

test("shows green dot when done", () => {
  const tool = makeToolInvocation(
    "str_replace_editor",
    { command: "create", path: "src/components/App.tsx" },
    "result",
    "Success"
  );
  const { container } = render(<ToolInvocationBadge tool={tool} />);
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("shows spinner when pending", () => {
  const tool = makeToolInvocation(
    "str_replace_editor",
    { command: "str_replace", path: "src/styles.css" },
    "call"
  );
  const { container } = render(<ToolInvocationBadge tool={tool} />);
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows 'Editing <file>' for str_replace command", () => {
  const tool = makeToolInvocation(
    "str_replace_editor",
    { command: "str_replace", path: "src/styles.css" },
    "result",
    "Success"
  );
  render(<ToolInvocationBadge tool={tool} />);
  expect(screen.getByText("Editing styles.css")).toBeDefined();
});

test("shows 'Editing <file>' for insert command", () => {
  const tool = makeToolInvocation(
    "str_replace_editor",
    { command: "insert", path: "src/main.tsx" },
    "result",
    "Success"
  );
  render(<ToolInvocationBadge tool={tool} />);
  expect(screen.getByText("Editing main.tsx")).toBeDefined();
});

test("shows 'Viewing <file>' for view command", () => {
  const tool = makeToolInvocation(
    "str_replace_editor",
    { command: "view", path: "README.md" },
    "result",
    "Success"
  );
  render(<ToolInvocationBadge tool={tool} />);
  expect(screen.getByText("Viewing README.md")).toBeDefined();
});

test("shows 'Renaming <file>' for file_manager rename command", () => {
  const tool = makeToolInvocation(
    "file_manager",
    { command: "rename", source_path: "src/old.tsx", destination_path: "src/new.tsx" },
    "result",
    "Success"
  );
  render(<ToolInvocationBadge tool={tool} />);
  expect(screen.getByText("Renaming old.tsx")).toBeDefined();
});

test("shows 'Deleting <file>' for file_manager delete command", () => {
  const tool = makeToolInvocation(
    "file_manager",
    { command: "delete", path: "src/unused.ts" },
    "result",
    "Success"
  );
  render(<ToolInvocationBadge tool={tool} />);
  expect(screen.getByText("Deleting unused.ts")).toBeDefined();
});

test("falls back to raw toolName for unknown tools", () => {
  const tool = makeToolInvocation("unknown_tool", {}, "result", "done");
  render(<ToolInvocationBadge tool={tool} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});
