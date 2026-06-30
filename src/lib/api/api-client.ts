import { API_URL } from "@/lib/utils";

/** Error thrown by the API client; carries the HTTP status and backend `detail`. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

function isReauthRequired(status: number, detail: string): boolean {
  return status === 409 && detail === "github_reauth_required";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include", // sends the httponly session cookie
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  // Session expired — bounce to the login page.
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login";
    throw new ApiError(401, "unauthorized");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { detail?: string };
    const detail = body.detail ?? "Unknown error";
    // GitHub token expired (not the session) — re-run the OAuth flow.
    if (isReauthRequired(res.status, detail) && typeof window !== "undefined") {
      window.location.href = `${API_URL}/auth/github/login`;
    }
    throw new ApiError(res.status, detail);
  }

  // 204 No Content (e.g. DELETE) — nothing to parse.
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  // Some endpoints (e.g. logout redirects) return non-JSON bodies.
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(path: string, data: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T = void>(path: string) => request<T>(path, { method: "DELETE" }),
};
