import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type { PullRequest, PullRequestFilters } from "@/types/api";

export const pullRequestKeys = {
  all: ["pull-requests"] as const,
  list: (repoId: string, filters: PullRequestFilters) =>
    [...pullRequestKeys.all, repoId, "list", filters] as const,
};

export function usePullRequests(repoId: string, filters: PullRequestFilters = {}) {
  return useQuery({
    queryKey: pullRequestKeys.list(repoId, filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.author) params.set("author", filters.author);
      if (filters.label) params.set("label", filters.label);
      if (filters.since) params.set("since", filters.since);
      const qs = params.toString();
      return apiClient.get<PullRequest[]>(
        `/repositories/${repoId}/pull-requests${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
