# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run Vitest unit tests
npm run setup        # Full setup: install → prisma generate → prisma migrate
npm run db:reset     # Force reset SQLite database
```

## Architecture

UIGen is a Next.js 15 app that uses Claude (via Vercel AI SDK) to generate React components in real-time with live preview.

### Core Data Flow

1. User message → `ChatProvider` (chat-context.tsx) → `/api/chat` (streaming)
2. API builds prompt with Anthropic prompt caching, initializes `VirtualFileSystem` from serialized DB state
3. Claude responds with tool calls: `str_replace_editor` and `file_manager`
4. `FileSystemContext` executes tool calls, updating in-memory VFS and triggering re-renders
5. On completion, project (messages + VFS) saved to Prisma (authenticated users only)

### Key Abstractions

**VirtualFileSystem** (`src/lib/file-system.ts`) — in-memory file tree, no disk I/O. `serialize()` / `deserializeFromNodes()` bridge DB persistence (stored as JSON in Prisma). All file operations in the editor and preview go through this.

**PreviewFrame** (`src/components/preview/`) — renders generated code by transpiling JSX with Babel standalone in the browser. Hot-reloads on file changes.

**ChatProvider** (`src/lib/contexts/chat-context.tsx`) — wraps Vercel AI SDK's `useChat`, manages tool call execution, file system state, and project save logic.

**Provider** (`src/lib/provider.ts`) — selects Claude or a mock LLM based on `ANTHROPIC_API_KEY` presence. Use mock for testing without an API key.

**Tools** (`src/lib/tools/`) — `str-replace.ts` implements string-replace editor; `file-manager.ts` handles rename/delete. These are the tool schemas passed to Claude.

**System Prompt** (`src/lib/prompts/generation.tsx`) — defines Claude's behavior for component generation; edit here to change generation style or constraints.

### Auth & Persistence

- JWT in HttpOnly cookies (7-day expiry), managed in `src/lib/auth.ts`
- SQLite via Prisma: `User` and `Project` models; project stores serialized messages and VFS as JSON strings
- Anonymous users: work tracked in `anon-work-tracker.ts` via localStorage; prompts sign-up for persistence
- Database schema is defined in `prisma/schema.prisma` — reference it whenever you need to understand the structure of data stored in the database

### UI Layout

Main layout (`src/app/main-content.tsx`) uses resizable panels: Chat panel | Code editor (Monaco) + Preview frame. Project pages at `app/[projectId]/page.tsx`.

### Path Aliases

`@/*` maps to `src/*` — use this for all internal imports.

## Code Style

Use comments sparingly. Only comment complex or non-obvious code.
