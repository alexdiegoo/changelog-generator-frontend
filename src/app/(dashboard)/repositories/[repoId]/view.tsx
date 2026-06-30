"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { RowSelectionState } from "@tanstack/react-table";
import { ArrowLeftIcon, FileTextIcon, GitPullRequestIcon } from "lucide-react";
import { Section } from "@/components/shared/layout/section";
import { PageHeader } from "@/components/shared/layout/page-header";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { ErrorAlert } from "@/components/shared/feedback/error-alert";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button";
import { SyncRepositoryButton } from "@/components/shared/repositories/sync-repository-button";
import { useImportedRepositories } from "@/hooks/queries/use-repositories";
import { usePullRequests } from "@/hooks/queries/use-pull-requests";
import type { PullRequestFilters } from "@/types/api";
import { pullRequestColumns } from "./_components/pull-request-columns";
import { PrFilters } from "./_components/pr-filters";
import { GenerateChangelogDialog } from "./_components/generate-changelog-dialog";

export function RepositoryDetailView({ repoId }: { repoId: string }) {
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filters: PullRequestFilters = {
    author: searchParams.get("author") ?? undefined,
    label: searchParams.get("label") ?? undefined,
    since: searchParams.get("since") ?? undefined,
  };

  const repos = useImportedRepositories();
  const repo = repos.data?.find((r) => r.id === repoId);

  const { data, isLoading, isError, error, refetch, isFetching } =
    usePullRequests(repoId, filters);

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );

  const hasActiveFilters = !!(filters.author || filters.label || filters.since);

  return (
    <Section>
      <PageHeader
        title={repo?.full_name ?? "Pull requests"}
        description="Select merged pull requests to include in a changelog."
        eyebrow={
          <Link
            href="/repositories"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Repositories
          </Link>
        }
      >
        <Button variant="ghost" render={<Link href={`/repositories/${repoId}/changelogs`} />}>
          <FileTextIcon />
          Changelog history
        </Button>
        <SyncRepositoryButton repoId={repoId} />
      </PageHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PrFilters />
          <GenerateChangelogDialog
            repoId={repoId}
            pullRequestIds={selectedIds}
          />
        </div>

        {isError ? (
          <ErrorAlert error={error} onRetry={() => refetch()} />
        ) : (
          <DataTable
            columns={pullRequestColumns}
            data={data ?? []}
            isLoading={isLoading}
            getRowId={(pr) => pr.id}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            emptyState={
              <EmptyState
                icon={GitPullRequestIcon}
                title={
                  hasActiveFilters
                    ? "No pull requests match these filters"
                    : "No pull requests synced yet"
                }
                description={
                  hasActiveFilters
                    ? "Try clearing the author, label, or date filters."
                    : "Sync this repository to pull its merged pull requests from GitHub."
                }
                action={
                  hasActiveFilters ? undefined : (
                    <SyncRepositoryButton repoId={repoId} />
                  )
                }
              />
            }
          />
        )}

        {selectedIds.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {selectedIds.length} pull request
            {selectedIds.length === 1 ? "" : "s"} selected
            {isFetching ? " · refreshing…" : ""}
          </p>
        ) : null}
      </div>
    </Section>
  );
}
