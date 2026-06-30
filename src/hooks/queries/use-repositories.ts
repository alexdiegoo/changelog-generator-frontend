import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import type {
  AvailableRepository,
  Repository,
  RepositoryImportPayload,
  SyncResult,
} from "@/types/api";

export type AvailableRepoFilters = {
  owner_type?: "org" | "user";
  language?: string;
};

export const repositoryKeys = {
  all: ["repositories"] as const,
  imported: () => [...repositoryKeys.all, "imported"] as const,
  available: (filters: AvailableRepoFilters) =>
    [...repositoryKeys.all, "available", filters] as const,
};

/** Repositories the user has already imported (GET /repositories). */
export function useImportedRepositories() {
  return useQuery({
    queryKey: repositoryKeys.imported(),
    queryFn: () => apiClient.get<Repository[]>("/repositories"),
  });
}

/** GitHub repos available to import (GET /repositories/available). */
export function useAvailableRepositories(filters: AvailableRepoFilters = {}) {
  return useQuery({
    queryKey: repositoryKeys.available(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.owner_type) params.set("owner_type", filters.owner_type);
      if (filters.language) params.set("language", filters.language);
      const qs = params.toString();
      return apiClient.get<AvailableRepository[]>(
        `/repositories/available${qs ? `?${qs}` : ""}`,
      );
    },
    staleTime: 1000 * 60 * 5, // GitHub repo list is fairly stable
  });
}

export function useImportRepository() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RepositoryImportPayload) =>
      apiClient.post<Repository>("/repositories", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: repositoryKeys.imported() });
    },
  });
}

export function useRemoveRepository() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (repoId: string) =>
      apiClient.delete(`/repositories/${repoId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: repositoryKeys.imported() });
    },
  });
}

export function useSyncRepository(repoId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<SyncResult>(`/repositories/${repoId}/sync`),
    onSuccess: () => {
      // New PRs may have arrived — refresh this repo's PR list.
      qc.invalidateQueries({ queryKey: ["pull-requests", repoId] });
    },
  });
}
