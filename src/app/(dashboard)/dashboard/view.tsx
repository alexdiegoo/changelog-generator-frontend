"use client";

import { FolderGitIcon } from "lucide-react";
import { Section } from "@/components/shared/layout/section";
import { PageHeader } from "@/components/shared/layout/page-header";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { ErrorAlert } from "@/components/shared/feedback/error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ImportRepositoryDialog } from "@/components/shared/repositories/import-repository-dialog";
import { RepositoryCard } from "@/components/shared/repositories/repository-card";
import { useImportedRepositories } from "@/hooks/queries/use-repositories";

export function DashboardView() {
  const { data, isLoading, isError, error, refetch } =
    useImportedRepositories();

  return (
    <Section>
      <PageHeader
        title="Dashboard"
        description="Your imported repositories at a glance."
      >
        <ImportRepositoryDialog />
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorAlert error={error} onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={FolderGitIcon}
          title="No repositories imported yet"
          description="Import a GitHub repository to start generating changelogs from its merged pull requests."
          action={<ImportRepositoryDialog />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      )}
    </Section>
  );
}
