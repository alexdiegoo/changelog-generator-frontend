"use client";

import Link from "next/link";
import { ArrowLeftIcon, CheckCircle2Icon, PencilIcon } from "lucide-react";
import { Section } from "@/components/shared/layout/section";
import { PageHeader } from "@/components/shared/layout/page-header";
import { ErrorAlert } from "@/components/shared/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ToneBadge } from "@/components/shared/changelogs/tone-badge";
import { useChangelog } from "@/hooks/queries/use-changelogs";
import { formatDateTime } from "@/lib/utils";
import { ChangelogEditor } from "./_components/changelog-editor";
import { ExportMenu } from "./_components/export-menu";
import { PublishButton } from "./_components/publish-button";

export function ChangelogDetailView({ id }: { id: string }) {
  const { data: changelog, isLoading, isError, error, refetch } =
    useChangelog(id);

  if (isLoading) return <ChangelogDetailSkeleton />;

  if (isError) {
    return (
      <Section>
        <ErrorAlert error={error} onRetry={() => refetch()} />
      </Section>
    );
  }

  if (!changelog) return null;

  return (
    <Section>
      <PageHeader
        title={changelog.version ? `Changelog ${changelog.version}` : "Changelog draft"}
        description={`Generated ${formatDateTime(changelog.created_at)}`}
        eyebrow={
          <Link
            href={`/repositories/${changelog.repository_id}/changelogs`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Changelog history
          </Link>
        }
      >
        <ExportMenu changelogId={changelog.id} />
        <PublishButton changelog={changelog} />
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <ToneBadge tone={changelog.tone} />
        <Badge variant="outline">{changelog.language}</Badge>
        {changelog.edited ? (
          <Badge variant="secondary">
            <PencilIcon className="size-3" />
            Edited
          </Badge>
        ) : null}
        {changelog.published_at ? (
          <Badge variant="default">
            <CheckCircle2Icon className="size-3" />
            Published {formatDateTime(changelog.published_at)}
          </Badge>
        ) : null}
      </div>

      <ChangelogEditor changelogId={changelog.id} content={changelog.content} />
    </Section>
  );
}

function ChangelogDetailSkeleton() {
  return (
    <Section>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-36" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-[28rem] w-full rounded-md" />
    </Section>
  );
}
