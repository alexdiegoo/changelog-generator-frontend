import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import { API_URL } from "@/lib/utils";
import type {
  Changelog,
  ExportFormat,
  GenerateChangelogPayload,
  PublishResult,
} from "@/types/api";

export const changelogKeys = {
  all: ["changelogs"] as const,
  detail: (id: string) => [...changelogKeys.all, "detail", id] as const,
  list: (repoId: string) =>
    [...changelogKeys.all, "repo", repoId, "list"] as const,
};

/** History of changelogs for a repository (GET /repositories/{id}/changelogs). */
export function useChangelogs(repoId: string) {
  return useQuery({
    queryKey: changelogKeys.list(repoId),
    queryFn: () =>
      apiClient.get<Changelog[]>(`/repositories/${repoId}/changelogs`),
    placeholderData: keepPreviousData,
  });
}

/** A single changelog (GET /changelogs/{id}). */
export function useChangelog(id: string) {
  return useQuery({
    queryKey: changelogKeys.detail(id),
    queryFn: () => apiClient.get<Changelog>(`/changelogs/${id}`),
    // A generated changelog doesn't change on its own — don't refetch on focus.
    staleTime: 1000 * 60 * 5,
  });
}

export function useGenerateChangelog(repoId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GenerateChangelogPayload) =>
      apiClient.post<Changelog>(
        `/repositories/${repoId}/changelogs`,
        payload,
      ),
    onSuccess: (changelog) => {
      qc.invalidateQueries({ queryKey: changelogKeys.list(repoId) });
      qc.setQueryData(changelogKeys.detail(changelog.id), changelog);
    },
  });
}

export function useUpdateChangelog(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      apiClient.patch<Changelog>(`/changelogs/${id}`, { content }),
    onSuccess: (changelog) => {
      qc.setQueryData(changelogKeys.detail(id), changelog);
      qc.invalidateQueries({
        queryKey: changelogKeys.list(changelog.repository_id),
      });
    },
  });
}

export function usePublishChangelog(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<PublishResult>(`/changelogs/${id}/publish`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: changelogKeys.detail(id) });
    },
  });
}

/** Direct backend URL for downloading/exporting a changelog (browser navigation). */
export function changelogExportUrl(id: string, format: ExportFormat): string {
  return `${API_URL}/changelogs/${id}/export?format=${format}`;
}
