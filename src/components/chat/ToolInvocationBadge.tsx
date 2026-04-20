"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface Props {
  tool: ToolInvocation;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  if (toolName === "str_replace_editor") {
    const file =
      typeof args.path === "string" ? args.path.split("/").pop() : "";
    switch (args.command) {
      case "create":
        return `Creating ${file}`;
      case "str_replace":
      case "insert":
        return `Editing ${file}`;
      case "view":
        return `Viewing ${file}`;
      default:
        return `Updating ${file}`;
    }
  }
  if (toolName === "file_manager") {
    const file =
      typeof args.path === "string"
        ? args.path.split("/").pop()
        : typeof args.source_path === "string"
          ? args.source_path.split("/").pop()
          : "";
    switch (args.command) {
      case "rename":
        return `Renaming ${file}`;
      case "delete":
        return `Deleting ${file}`;
      default:
        return `Managing ${file}`;
    }
  }
  return toolName;
}

export function ToolInvocationBadge({ tool }: Props) {
  const label = getLabel(tool.toolName, tool.args ?? {});
  const isDone = tool.state === "result" && tool.result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
