"use client";

import { FolderGitIcon } from "lucide-react";
import { Section } from "@/components/shared/layout/section";
import { PageHeader } from "@/components/shared/layout/page-header";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { ErrorAlert } from "@/components/shared/feedback/error-alert";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ImportRepositoryDialog } from "@/components/shared/repositories/import-repository-dialog";
import { useImportedRepositories } from "@/hooks/queries/use-repositories";
import { repositoryColumns } from "./_components/repository-columns";

export function RepositoriesView() {
  const { data, isLoading, isError, error, refetch } =
    useImportedRepositories();

  return (
    <Section>
      <PageHeader
        title="Repositories"
        description="Repositories imported from GitHub."
      >
        <ImportRepositoryDialog />
      </PageHeader>

      {isError ? (
        <ErrorAlert error={error} onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={repositoryColumns}
          data={data ?? []}
          isLoading={isLoading}
          getRowId={(repo) => repo.id}
          emptyState={
            <EmptyState
              icon={FolderGitIcon}
              title="No repositories imported yet"
              description="Import a GitHub repository to start generating changelogs."
              action={<ImportRepositoryDialog />}
            />
          }
        />
      )}
    </Section>
  );
}
