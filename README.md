# AI Changelog Generator — Frontend

Next.js 16 (App Router) frontend that connects to the FastAPI backend in [`../api`](../api),
reads merged GitHub pull requests, and generates AI changelogs you can preview, edit,
export, and publish as GitHub Releases.

## Stack

- **Next.js 16** (App Router) · React 19
- **shadcn/ui** (Nova preset — built on **Base UI** primitives) · Tailwind CSS v4
- **TanStack Query v5** (data fetching) · **TanStack Table v8** (tables)
- **React Hook Form v7** + **Zod v4** (forms & validation)
- TypeScript (strict)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your FastAPI backend
pnpm dev                     # http://localhost:3000
```

The backend must be running (default `http://localhost:8000`) and its `FRONTEND_URL`
must point back to this app (`http://localhost:3000`) so the GitHub OAuth redirect and
the session cookie work across origins.

### Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend (e.g. `http://localhost:8000`) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Routes & flow

| Route | Purpose |
|-------|---------|
| `/login` | GitHub OAuth entrypoint (sign in = sign up) |
| `/auth/callback` | Handles the redirect back from the backend after OAuth |
| `/dashboard` | Imported repositories at a glance + import dialog |
| `/repositories` | Manage imported repos (sync / remove / open) |
| `/repositories/[repoId]` | Sync & select merged PRs (filters by author/label/date), then generate |
| `/repositories/[repoId]/changelogs` | Changelog history for a repository |
| `/changelogs/[id]` | Preview/edit a changelog, export (md/json/html), publish as Release |

## Backend integration

All requests go through `src/lib/api/api-client.ts` (typed `fetch` wrapper, sends the
`httponly` session cookie via `credentials: "include"`). Data fetching is done exclusively
through TanStack Query hooks in `src/hooks/queries/`.

- `401` → redirect to `/login` (session expired).
- `409 github_reauth_required` → "Reconnect GitHub" path (GitHub token expired).

> Two read endpoints were added to the backend to support the UI:
> `GET /repositories` (list imported repos) and `GET /changelogs/{id}` (single changelog).
