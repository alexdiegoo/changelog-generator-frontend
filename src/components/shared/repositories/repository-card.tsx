import Link from "next/link";
import { FileTextIcon, GitPullRequestIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelative } from "@/lib/utils";
import type { Repository } from "@/types/api";

export function RepositoryCard({ repository }: { repository: Repository }) {
  return (
    <Link
      href={`/repositories/${repository.id}`}
      className="group block focus-visible:outline-none"
    >
      <Card className="h-full transition-colors group-hover:border-primary/50 group-focus-visible:border-primary">
        <CardHeader>
          <CardTitle className="truncate text-base">
            {repository.full_name}
          </CardTitle>
          <CardDescription>
            Imported {formatRelative(repository.created_at)}
          </CardDescription>
        </CardHeader>
        <div className="flex items-center gap-4 px-6 pb-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <GitPullRequestIcon className="size-4" />
            Pull requests
          </span>
          <span className="flex items-center gap-1.5">
            <FileTextIcon className="size-4" />
            Changelogs
          </span>
        </div>
      </Card>
    </Link>
  );
}
