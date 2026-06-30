import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import { API_URL } from "@/lib/utils";
import type { CurrentUser } from "@/types/api";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** Current authenticated user. A 401 triggers a redirect inside the api-client. */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => apiClient.get<CurrentUser>("/auth/me"),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

/** Backend endpoint that starts the GitHub OAuth flow (full-page navigation). */
export const githubLoginUrl = `${API_URL}/auth/github/login`;

/** Clears the session cookie on the backend, then sends the user to /login. */
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSettled: () => {
      qc.clear();
      window.location.href = "/login";
    },
  });
}
