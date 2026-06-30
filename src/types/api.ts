/**
 * Response/request types mirroring the FastAPI/Pydantic schemas one-to-one.
 * Keep these in sync with `api/app/schemas/*` and the router signatures.
 */

/** GET /auth/me */
export type CurrentUser = {
  id: string;
  username: string;
  avatar_url: string | null;
};

/** RepositoryRead — GET /repositories, POST /repositories */
export type Repository = {
  id: string;
  github_id: number;
  full_name: string;
  created_at: string | null;
};

/** Item from GET /repositories/available (raw GitHub repos, not yet imported) */
export type AvailableRepository = {
  id: number;
  name: string; // full_name, e.g. "owner/repo"
  private: boolean;
  owner_type: "org" | "user";
  language: string | null;
};

/** RepositoryImport — POST /repositories body */
export type RepositoryImportPayload = {
  github_id: number;
  full_name: string;
};

/** Response of POST /repositories/{repo_id}/sync */
export type SyncResult = {
  synced: boolean;
  new_pull_requests: number;
};

/** PullRequestRead — GET /repositories/{repo_id}/pull-requests */
export type PullRequest = {
  id: string;
  number: number;
  title: string;
  author: string;
  labels: string[];
  merged_at: string | null;
};

export type PullRequestFilters = {
  author?: string;
  label?: string;
  since?: string; // ISO datetime
};

export const CHANGELOG_TONES = ["technical", "executive", "public"] as const;
export type ChangelogTone = (typeof CHANGELOG_TONES)[number];

/** ChangelogRead — generate / get / list / patch */
export type Changelog = {
  id: string;
  repository_id: string;
  content: string;
  tone: ChangelogTone;
  language: string;
  version: string | null;
  edited: boolean;
  published_at: string | null;
  github_release_url: string | null;
  created_at: string | null;
};

/** ChangelogGenerateRequest — POST /repositories/{repo_id}/changelogs */
export type GenerateChangelogPayload = {
  pull_request_ids: string[];
  tone?: ChangelogTone;
  language?: string;
  version?: string;
};

/** Response of POST /changelogs/{id}/publish */
export type PublishResult = {
  release_url: string;
};

export type ExportFormat = "md" | "json" | "html";
