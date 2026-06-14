# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The import above is load-bearing: this repo runs **Next.js 16.2 / React 19**, whose
> APIs differ from older Next.js. Read the relevant guide in
> `node_modules/next/dist/docs/` (`01-app`, `03-architecture`, …) before writing
> framework code. Note `params` is a `Promise` in route handlers and pages here
> (see `app/c/[conversationId]/page.tsx`).

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

- `pnpm dev` — run the dev server (Turbopack)
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

There is **no test runner** configured in this project.

## Required environment (`.env`)

The app fails at runtime without these (all read via `process.env.X!`):

- `MONGODB_URI` — Mongo connection string
- `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` — NextAuth + GitHub OAuth
- `AGENT_URL` — external LLM agent endpoint the chat route POSTs to
- `TOKENS_PER_CREDIT` — optional, defaults to `1000`

## Architecture

Acela is an AI chat product ("I know everything about Celo"). A Next.js App Router
frontend talks to its own API routes, which persist to MongoDB via Mongoose and proxy
generation to an **external agent service** (`AGENT_URL`) — there is no LLM SDK in this
repo.

### Request flow (the core path)

`components/ChatShell.tsx` (client) → `hooks/useChat.ts` → `lib/chat-api.ts`
(`fetch`) → `app/api/chat/route.ts` → external `AGENT_URL` → MongoDB.

`app/api/chat/route.ts` is the heart of the system and does, in order: resolve the
user (auth session **or** guest cookie), find-or-create their `Conversation`,
load prior `Message`s, **pre-flight a credit check**, POST `{ messages }` to
`AGENT_URL`, then commit the user message, assistant reply, credit debit, and
conversation counters **inside a single `mongoose` transaction**
(`session.withTransaction`). The agent's response shape is tolerated loosely and
normalized in `lib/agent.ts` (`getAgentReply` / `getTotalTokens` /
`safeParseAgentResponse`).

### Identity: dual user model

Every request belongs to either an **authenticated user** (matched by
`session.user.email`) or a **guest** (matched by a `guestId` http-only cookie set on
first chat). Ownership queries everywhere branch on this:
`session?.user?.email ? { userId } : { guestId }`. When adding any user-scoped
endpoint, you must handle **both** cases — see `app/api/conversations/recent/route.ts`
and `.../[conversationId]/messages/route.ts` for the pattern. Recent-chats pagination
uses an opaque base64 `(lastMessageAt, _id)` cursor.

### Auth (`lib/auth.ts`)

NextAuth v5 (beta) with **JWT sessions**, GitHub provider only. A custom `signIn`
callback manually upserts `User` + `Account` documents (this app does **not** use the
mongodb adapter for the flow, despite the dependency). The `jwt`/`session` callbacks
copy `userId` and `role` from the DB onto the token/session. `SessionUser` is augmented
onto NextAuth's `Session` in `next-auth.d.ts`. Note: the chat route also lazily creates
a `User` on first message, so users can exist before `signIn` runs.

### Credits & billing (`lib/credits.ts`)

`plans` is the source of truth for tiers (guest_free=5, authenticated_free=10, plus
paid `purchase_2/5/10`). Tokens → credits via `tokensToCredits` (ceil, min 1) using
`TOKENS_PER_CREDIT`. Token counts come from the agent's `usage.total_tokens` when
present, else a `length/4` estimate (`estimateTokensFromText`). Credits are checked
twice: an optimistic pre-flight (estimate × 1.2) and an authoritative re-check inside
the transaction (`INSUFFICIENT_CREDITS` → HTTP 402).

### Data models (`models/`)

Mongoose schemas, each exported with the `mongoose.models.X || mongoose.model(...)`
guard to survive dev hot-reload. `connectDB()` (`lib/mongoose.ts`) memoizes the
connection on `global.mongoose`. Models: `User` (credits + guest fields),
`Conversation` (counters, `userId`/`guestId`, indexed by `lastMessageAt`), `Message`
(role/content/tokenCount, indexed by `conversationId+createdAt`), `Account`
(provider linkage, unique on provider+providerAccountId).

### Frontend conventions

- `ChatShell` is the single stateful client component, rendered by both `app/page.tsx`
  (new chat) and `app/c/[conversationId]/page.tsx` (existing), each wrapped in
  `<Suspense>`. `initialConversationId` distinguishes them.
- "Modes" (`idea` / `ask` / `explore`, the `AppMode` type) are passed as a `?mode=`
  query param to the chat API; default is `ask`.
- Shared types live in the root `types.ts`; import via the `@/*` path alias.
- Styling is **Tailwind v4** (CSS-first, `@import "tailwindcss"` + `@theme` in
  `app/globals.css`). The design system uses semantic color tokens — `bg-base`,
  `text-text-1`, `text-primary`, etc. — defined there; the app is dark-mode only.
- Hooks in `hooks/` own data fetching (`useChat`, `useRecentChats`, `useNewChat`);
  components stay presentational.
