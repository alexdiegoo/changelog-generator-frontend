"use client";

import Link from "next/link";
import { ArrowLeftIcon, FileTextIcon, GitPullRequestIcon } from "lucide-react";
import { Section } from "@/components/shared/layout/section";
import { PageHeader } from "@/components/shared/layout/page-header";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { ErrorAlert } from "@/components/shared/feedback/error-alert";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button";
import { useChangelogs } from "@/hooks/queries/use-changelogs";
import { useImportedRepositories } from "@/hooks/queries/use-repositories";
import { changelogColumns } from "./_components/changelog-columns";

export function ChangelogHistoryView({ repoId }: { repoId: string }) {
  const repos = useImportedRepositories();
  const repo = repos.data?.find((r) => r.id === repoId);

  const { data, isLoading, isError, error, refetch } = useChangelogs(repoId);

  return (
    <Section>
      <PageHeader
        title="Changelog history"
        description={
          repo ? `Past changelogs for ${repo.full_name}.` : "Past changelogs."
        }
        eyebrow={
          <Link
            href={`/repositories/${repoId}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Pull requests
          </Link>
        }
      >
        <Button render={<Link href={`/repositories/${repoId}`} />}>
          <GitPullRequestIcon />
          Generate new
        </Button>
      </PageHeader>

      {isError ? (
        <ErrorAlert error={error} onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={changelogColumns}
          data={data ?? []}
          isLoading={isLoading}
          getRowId={(c) => c.id}
          emptyState={
            <EmptyState
              icon={FileTextIcon}
              title="No changelogs yet"
              description="Select pull requests and generate your first changelog for this repository."
              action={
                <Button render={<Link href={`/repositories/${repoId}`} />}>
                  Select pull requests
                </Button>
              }
            />
          }
        />
      )}
    </Section>
  );
}
