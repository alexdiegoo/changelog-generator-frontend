# Frontend Project — Claude Code Context

## Project Context — What We're Building

This is the frontend for **AI Changelog Generator**, a tool that connects to a developer's
GitHub account, reads merged pull requests, and uses AI (Gemini API) to generate
changelogs — selectable by tone — that can be previewed, edited, exported, and published
directly as a GitHub Release.

### Domain — the changelog generation flow

The product walks the user through a single end-to-end journey:

1. **Login with GitHub** — the user authenticates via GitHub OAuth (this is also account
   creation — there is no separate signup/login with email/password).
2. **Connect & import repositories** — list the user's available GitHub repos and import
   the ones they want to track.
3. **Sync & select pull requests** — pull merged PRs from the imported repo, filter/select
   which ones go into the changelog (individually or by version range).
4. **Generate with AI** — pick a tone (technical / executive / public) and language, send
   selected PRs to the backend, receive an AI-generated changelog draft.
5. **Review & edit** — preview the generated changelog, edit inline before exporting.
6. **Export or publish** — export as Markdown / JSON / HTML, or publish directly as a
   GitHub Release.
7. **History** — view past changelogs generated per repository.

### Domain vocabulary

Prefer changelog/dev-tooling domain terms in code and UI: **repository, pull request (PR),
changelog, tone (technical/executive/public), version, release, label, author, merged_at**.
The generic `customer` examples below are illustrative of the *patterns* — name real
entities after the domain (e.g. `usePullRequests`, `pullRequestKeys`, `ChangelogDto`).

---

## Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4
- **Data Fetching**: TanStack Query v5
- **Tables**: TanStack Table v8
- **Forms**: React Hook Form v7 + Zod v4 (via `@hookform/resolvers`)
- **Language**: TypeScript (strict mode)
- **Backend**: FastAPI (Python) — consumed directly from the client, no BFF layer

---

## MCP — Context7 (Library Documentation)

Before writing or modifying code that uses any of the project's libraries, **always consult Context7** to get accurate, version-specific documentation. Never rely solely on training data for library APIs — versions change and the docs may be outdated.

### When to use Context7

| Situation | Action |
|-----------|--------|
| Using a TanStack Query API (`useQuery`, `useMutation`, `useInfiniteQuery`, etc.) | Fetch docs first |
| Configuring TanStack Table (`ColumnDef`, row models, pagination, sorting) | Fetch docs first |
| Adding or configuring a shadcn/ui component | Fetch docs first |
| Using a Tailwind CSS v4 utility or config | Fetch docs first |
| Using Next.js App Router APIs (`generateMetadata`, `cookies`, etc.) | Fetch docs first |
| Unsure about a hook signature, option name, or behavior | Fetch docs first |

### How to use

```
use context7 to get the docs for <library> — <topic>
```

**Examples:**

```
use context7 to get the docs for tanstack-query — useMutation options
use context7 to get the docs for tanstack-table — server-side pagination
use context7 to get the docs for shadcn/ui — DataTable with sorting
use context7 to get the docs for next.js — Route Handlers cookies
use context7 to get the docs for tailwindcss — v4 configuration
```

### Library IDs for Context7

| Library | Context7 ID |
|---------|------------|
| Next.js | `/vercel/next.js` |
| TanStack Query v5 | `/tanstack/query` |
| TanStack Table v8 | `/tanstack/table` |
| shadcn/ui | `/shadcn-ui/ui` |
| Tailwind CSS v4 | `/tailwindlabs/tailwindcss` |
| Zod | `/colinhacks/zod` |
| React Hook Form | `/react-hook-form/react-hook-form` |

### Rule

> If you are about to write an API call, hook usage, or component configuration from memory — stop and query Context7 first. A single outdated API assumption can cascade into broken behavior that's hard to debug.

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: login page (GitHub OAuth entrypoint)
│   ├── (dashboard)/              # Route group: authenticated pages
│   │   └── [feature]/
│   │       ├── page.tsx          # Server Component shell — renders <View /> only
│   │       ├── view.tsx          # Client Component ("use client") — builds the full page UI
│   │       └── _components/      # Components scoped to this route only
│   └── auth/
│       └── callback/
│           └── page.tsx          # Handles redirect back from the backend after GitHub OAuth
│
├── components/
│   ├── ui/                       # shadcn primitives (DO NOT edit manually)
│   └── shared/                   # Reusable composed components
│       ├── data-table/           # TanStack Table base components
│       ├── forms/                # Reusable form building blocks
│       ├── feedback/             # Toast, Alert, Empty state, Skeleton
│       ├── layout/               # PageHeader, Section, Container, Sidebar
│       └── typography/           # Heading, Text, Label variants
│
├── hooks/
│   ├── queries/                  # TanStack Query hooks (use-*.ts)
│   └── ui/                      # UI-only hooks (use-debounce, use-disclosure)
│
├── lib/
│   ├── api/                      # fetch wrapper for the FastAPI backend (api-client.ts)
│   ├── utils.ts                  # cn(), formatters, helpers
│   └── validations/              # Zod schemas for forms and standalone inputs
│
├── types/
│   ├── api.ts                    # Response/request types from the FastAPI backend
│   └── ui.ts                    # UI-only types (TableColumn, SelectOption…)
│
└── styles/
    └── globals.css               # Tailwind base + CSS variable theme tokens
```

---

## Routing & Pages

- Every `page.tsx` is a **Server Component** (never add `"use client"` to it) — its responsibilities are limited to: exporting `metadata`, reading server-only inputs (`params`, `searchParams`, `cookies`), optional server-side prefetch with `prefetchQuery`, and rendering the page's `<View />`.
- **Every route folder must contain a `view.tsx` file** — a Client Component (`"use client"`) that builds the page's full UI. The `page.tsx` does nothing but render it. This keeps the server/client boundary explicit and consistent across every page.
- The `view.tsx` component is named after the route in PascalCase with a `View` suffix and exported as a **named export** (e.g. `LoginView`, `RepositoriesView`, `ChangelogDetailView`). `page.tsx` imports it from `./view`.
- If the page prefetches data, pass server-fetched values into the view as props (or hydrate via a `HydrationBoundary`); the view itself fetches client-side through TanStack Query hooks.
- Colocate route-specific sub-components in `_components/` inside the route folder. If a component is used in 2+ routes, move it to `components/shared/`.
- Use **Route Groups** `(group)` to share layouts without affecting the URL.
- Never put business logic or UI markup directly in `page.tsx`; the view owns the UI, hooks own the logic.

```tsx
// app/(dashboard)/repositories/page.tsx — Server Component shell
import { RepositoriesView } from "./view";

export const metadata = { title: "Repositories" };

export default function RepositoriesPage() {
  return <RepositoriesView />;
}
```

```tsx
// app/(dashboard)/repositories/view.tsx — Client Component that builds the full UI
"use client";

import { useRepositories } from "@/hooks/queries/use-repositories";

export function RepositoriesView() {
  const { data, isLoading } = useRepositories();
  // ...full page UI lives here
}
```

---

## Calling the Backend — Direct FastAPI Integration

There is **no Route Handler / BFF layer** in this project. The frontend calls the FastAPI
backend directly from TanStack Query hooks, through a single typed fetch wrapper.

### Rules

- All requests go through `lib/api/api-client.ts` — never call `fetch` with a raw backend
  URL from inside a component or hook.
- Authentication is session-based: the backend sets an `httponly` session cookie on
  GitHub OAuth callback. The browser sends it automatically on same-site requests —
  **never read or attach the token manually on the client** (it's not accessible to JS,
  by design).
- Configure the client to always send credentials (`credentials: "include"`) so the
  session cookie is included in cross-origin requests between the Next.js app and the
  FastAPI backend.
- The backend's base URL lives in `NEXT_PUBLIC_API_URL` — never hardcode it.
- On a `401` response, redirect the user to `/login` (session expired). On a `409` with
  `detail: "github_reauth_required"`, redirect to the GitHub OAuth login endpoint
  directly (the GitHub token itself expired, not the session).

```ts
// lib/api/api-client.ts — typed fetch wrapper for the FastAPI backend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

class ApiError extends Error {
  constructor(public status: number, public detail: string) {
    super(detail);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: "include", // sends the httponly session cookie
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (res.status === 401) {
    window.location.href = "/login";
    throw new ApiError(401, "unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 409 && body.detail === "github_reauth_required") {
      window.location.href = `${BASE_URL}/auth/github/login`;
    }
    throw new ApiError(res.status, body.detail ?? "Unknown error");
  }

  return res.json();
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
```

```tsx
// GitHub login button — redirects straight to the backend's OAuth endpoint
export function GithubLoginButton() {
  return (
    <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/login`}>
      <Button>Sign in with GitHub</Button>
    </a>
  );
}
```

---

## TanStack Query — Data Fetching

All client-side data fetching must use TanStack Query. No raw `fetch` or `useEffect` for data — always go through `apiClient`.

### Query Hook Convention

- File: `hooks/queries/use-pull-requests.ts`
- Export one hook per resource, accepting filters/params as arguments.
- Always define and export `queryKey` factories for cache invalidation.

```ts
// hooks/queries/use-pull-requests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { PullRequest } from "@/types/api";

export const pullRequestKeys = {
  all: ["pull-requests"] as const,
  list: (repoId: string, params: PullRequestFilters) =>
    [...pullRequestKeys.all, repoId, "list", params] as const,
};

export function usePullRequests(repoId: string, params: PullRequestFilters) {
  return useQuery({
    queryKey: pullRequestKeys.list(repoId, params),
    queryFn: () =>
      apiClient.get<PullRequest[]>(
        `/repositories/${repoId}/pull-requests?${new URLSearchParams(params as any)}`
      ),
    staleTime: 1000 * 60, // 1 min
  });
}

export function useSyncRepository(repoId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post(`/repositories/${repoId}/sync`),
    onSuccess: () => qc.invalidateQueries({ queryKey: pullRequestKeys.all }),
  });
}
```

### Rules

- Always handle `isLoading`, `isError`, and empty states in the component.
- Use `staleTime` deliberately — avoid refetching on every focus for stable data (e.g. a
  generated changelog shouldn't refetch just because the tab regained focus).
- Invalidate with the most specific key possible after mutations.
- Use `placeholderData: keepPreviousData` for paginated lists (e.g. PR lists, changelog
  history) to avoid flicker.

---

## TanStack Table — All Tables

Every table in the application must be built with TanStack Table. Never use plain `<table>` HTML or a different table library.

### Base Component

Create a shared `DataTable` base in `components/shared/data-table/`:

```tsx
// components/shared/data-table/data-table.tsx
"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableSkeleton } from "./data-table-skeleton";
import { DataTableEmpty } from "./data-table-empty";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  emptyMessage = "No results found.",
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <DataTableSkeleton columns={columns.length} />;

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

- Define columns in a separate `columns.tsx` file colocated with the feature (e.g.
  `pull-request-columns.tsx` with a checkbox column for multi-select before generation).
- Server-side pagination: pass `manualPagination: true` and control state externally via URL params (`useSearchParams`).
- Sorting and filtering (by author, label, date) are controlled via URL params so they are shareable and survive refresh.

---

## Components — Composition Rules

All UI must be composed through components. No one-off inline markup in pages.

### Hierarchy

```
shadcn/ui primitives (components/ui/)
        ↓ composed into
Shared components (components/shared/)
        ↓ composed into
Feature components (app/[route]/_components/)
        ↓ assembled in
page.tsx
```

### Rules

- **Every page** must use `<PageHeader>`, `<Section>`, and layout components from `components/shared/layout/`.
- **Every form field** must go through a shared `<FormField>` wrapper that handles label, error, and description consistently.
- **Every loading state** must use a `<Skeleton>` variant — never a spinner as the only feedback. The changelog generation step (waiting on the AI response) is the most important place to get this right; use a skeleton that mimics the changelog preview layout, not a generic spinner.
- **Every empty state** must use the shared `<EmptyState>` component with an icon, title, and optional action (e.g. "No repositories imported yet" → action: "Import a repository").
- Never inline color values (`text-[#3b82f6]`) — only use theme tokens (see Theming section).
- Never copy-paste a component structure across two files. Extract first.

```tsx
// Good: composed through components
export function RepositoriesView() {
  const { data, isLoading } = useRepositories();
  return (
    <Section>
      <PageHeader title="Repositories" description="Repositories imported from GitHub">
        <ImportRepositoryButton />
      </PageHeader>
      <DataTable columns={repositoryColumns} data={data ?? []} isLoading={isLoading} />
    </Section>
  );
}
```

---

## Theming — CSS Variables

The design must follow the project's color theme exclusively. Never hardcode color values.

All tokens are defined in `globals.css` as CSS variables and consumed via Tailwind:

```css
/* styles/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --primary: 221 83% 53%;       /* Brand primary */
    --primary-foreground: 0 0% 100%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --border: 214 32% 91%;
    --ring: 221 83% 53%;
    /* ... extend with project-specific tokens */
  }
  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

### Rules

- Only use `bg-primary`, `text-foreground`, `border-border`, etc. — never `bg-blue-500`.
- When adding a new color to the design, add it as a CSS variable + Tailwind extension first.
- Run `npx shadcn@latest add` to add components — they inherit tokens automatically.
- Validate dark mode on every component before considering it done.

---

## TypeScript

- `strict: true` is non-negotiable.
- Never use `any`. Use `unknown` and narrow with Zod or type guards.
- API response types live in `types/api.ts`, matching the FastAPI/Pydantic schemas
  one-to-one (e.g. `Repository`, `PullRequest`, `Changelog`, `ChangelogTone`).
- Infer Zod schemas with `z.infer<typeof schema>` instead of duplicating types.
- Use `satisfies` operator to validate objects against types without losing inference.
- Prefer `type` over `interface` for data shapes; use `interface` for component props and extendable contracts.

---

## Forms & Client-Side Validation

**Every form and every standalone input must validate data on the client before any request is fired.** No exceptions — not even for simple single-field inputs.

### Rules

- All forms use **React Hook Form** + **Zod** resolver. Never submit without a schema.
- Every Zod schema lives in `lib/validations/` (e.g. `lib/validations/changelog.ts` for
  the generate/edit forms).
- `mode: "onBlur"` for most forms (validates on field blur); `mode: "onChange"` for longer forms with cross-field rules. Never leave the default `mode: "onSubmit"` — errors should surface before the submit button is pressed.
- Reuse `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormMessage>` from shadcn/ui — never render error messages manually.
- The submit button must be `disabled` while `!form.formState.isValid || isPending`. A request must never fire from an invalid form.
- For standalone inputs outside a full form (search boxes, inline edits, filters), use `zod.safeParse()` directly and block the request if parsing fails.
- The backend (FastAPI/Pydantic) re-validates everything independently — client-side
  validation here is purely UX, never assume the backend will trust the frontend.

### Installed packages & building blocks

The libraries are already installed — `react-hook-form`, `@hookform/resolvers`, and `zod`. Do not re-add them.

- The shadcn **`Form` primitives** live in `components/ui/form.tsx` (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`). Always compose forms from these — never wire `Controller` + manual `<p>` error markup by hand. `FormControl` forwards `aria-invalid`/`aria-describedby` and `FormMessage` renders the field's Zod error automatically.
- **`Form` is `FormProvider`** — spread the form instance into it (`<Form {...form}>`) so the field context is available, then put the native `<form onSubmit={form.handleSubmit(onSubmit)} noValidate>` inside it.
- **Reference implementation:** `app/(dashboard)/changelogs/[id]/generate/view.tsx` — the
  tone/language selection form before generation. Schema lives in
  `lib/validations/changelog.ts`.

### Patterns & gotchas

- **Cross-field validation** (e.g. version required only when publishing as a Release)
  uses `.refine()` on the object schema with `path: ["version"]` so the error attaches to
  the right field.
- **Custom/controlled inputs** (the tone `Select`, the PR multi-select `Checkbox`
  column) go inside `FormControl` and read `field.value` / call `field.onChange`
  explicitly. For a checkbox-driven selection: `checked={field.value}` +
  `onCheckedChange={(c) => field.onChange(c === true)}`, and forward `onBlur`/`ref`.
- **Derived values from a field** (e.g. a live PR-count badge based on selected IDs) use **`useWatch({ control: form.control, name })`** — never `form.watch(...)` in render, which the React Compiler cannot memoize and will warn on.
- **Submit handlers** receive already-validated, typed values (`onSubmit(values: GenerateChangelogDto)`); no need to re-parse on the client before firing the request.

### Schema convention

```ts
// lib/validations/changelog.ts
import { z } from "zod";

export const generateChangelogSchema = z.object({
  pullRequestIds: z.array(z.string()).min(1, "Select at least one pull request."),
  tone: z.enum(["technical", "executive", "public"]),
  language: z.string().min(2),
  version: z.string().optional(),
});

export type GenerateChangelogDto = z.infer<typeof generateChangelogSchema>;
```

### Form component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateChangelogSchema, type GenerateChangelogDto } from "@/lib/validations/changelog";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGenerateChangelog } from "@/hooks/queries/use-changelogs";

export function GenerateChangelogForm({ pullRequestIds }: { pullRequestIds: string[] }) {
  const form = useForm<GenerateChangelogDto>({
    resolver: zodResolver(generateChangelogSchema),
    mode: "onBlur",
    defaultValues: { pullRequestIds, tone: "technical", language: "pt-BR" },
  });

  const { mutate, isPending } = useGenerateChangelog();

  function onSubmit(values: GenerateChangelogDto) {
    // onSubmit only fires after Zod validation passes — safe to mutate
    mutate(values, {
      onSuccess: () => toast.success("Changelog generated."),
      onError: () => toast.error("Something went wrong."),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage /> {/* renders the Zod error automatically */}
            </FormItem>
          )}
        />
        {/* Submit is disabled until the form is valid and not loading */}
        <Button type="submit" disabled={!form.formState.isValid || isPending}>
          {isPending ? "Generating…" : "Generate Changelog"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Error & Loading States

Every async-driven component must handle all three states:

| State | Component to use |
|-------|-----------------|
| Loading | `<Skeleton>` matching layout shape |
| Error | `<Alert variant="destructive">` or `<ErrorBoundary>` |
| Empty | `<EmptyState icon={...} title={...} action={...} />` |

Use React Error Boundaries at the route level (`error.tsx`) to catch unexpected errors gracefully. Treat the `409 github_reauth_required` response from the API (see "Calling the Backend") as a distinct case — show a clear "Reconnect GitHub" message instead of a generic error, since it's an expected, recoverable state rather than a bug.

---

## Performance

- Prefer **Server Components** for anything that doesn't need interactivity or browser APIs.
- Use `next/image` for all images — never raw `<img>` (e.g. GitHub avatars).
- Use `next/font` for all fonts — never external font `<link>` tags.
- Dynamic imports (`next/dynamic`) for heavy client components (e.g. the Markdown
  preview/editor for the generated changelog).
- Avoid `useEffect` for derived state — compute it inline or with `useMemo`.
- Never put large static data in client bundles — fetch lazily or compute server-side.

---

## File & Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PullRequestTable.tsx` |
| Hooks | camelCase with `use-` prefix | `use-pull-requests.ts` |
| Utilities | kebab-case | `format-date.ts` |
| Types/interfaces | PascalCase | `ChangelogDto`, `TableColumn` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PR_SELECTION` |
| CSS class groups | sorted: layout → box → typography → color → state | — |

---

## Do Not

- ❌ Add `"use client"` to a `page.tsx` or build UI inside it — every page renders a `view.tsx` Client Component instead
- ❌ Call `fetch` with the raw backend URL from inside a component — always go through `apiClient` in `lib/api/`
- ❌ Read, store, or attach the session token manually on the client — it's an `httponly`
  cookie sent automatically; trying to access it from JS won't work and shouldn't be attempted
- ❌ Use `fetch` or `axios` inside components — always use a TanStack Query hook
- ❌ Use `useEffect` to fetch data
- ❌ Use `<table>` HTML directly — use `DataTable` with TanStack Table
- ❌ Hardcode colors — use CSS variable tokens only
- ❌ Edit files in `components/ui/` manually — use `npx shadcn@latest add`
- ❌ Put more than one route's components in the same `_components/` folder
- ❌ Use `any` in TypeScript
- ❌ Skip loading/error/empty states in any data-driven component
- ❌ Create a new component for something that already exists in `components/shared/`