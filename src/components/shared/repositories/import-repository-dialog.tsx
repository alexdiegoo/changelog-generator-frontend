"use client";

import { useMemo, useState } from "react";
import {
  CheckIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { ErrorAlert } from "@/components/shared/feedback/error-alert";
import { useDebounce } from "@/hooks/ui/use-debounce";
import { useDisclosure } from "@/hooks/ui/use-disclosure";
import {
  useAvailableRepositories,
  useImportRepository,
  useImportedRepositories,
  type AvailableRepoFilters,
} from "@/hooks/queries/use-repositories";
import { ApiError } from "@/lib/api/api-client";
import type { AvailableRepository } from "@/types/api";

type OwnerFilter = "all" | "user" | "org";

export function ImportRepositoryDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const { isOpen, setIsOpen } = useDisclosure();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button>
              <PlusIcon />
              Import repository
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import a repository</DialogTitle>
          <DialogDescription>
            Pick a GitHub repository to start tracking its merged pull requests.
          </DialogDescription>
        </DialogHeader>
        {isOpen ? <ImportRepositoryPicker /> : null}
      </DialogContent>
    </Dialog>
  );
}

function ImportRepositoryPicker() {
  const [owner, setOwner] = useState<OwnerFilter>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const filters: AvailableRepoFilters =
    owner === "all" ? {} : { owner_type: owner };

  const available = useAvailableRepositories(filters);
  const imported = useImportedRepositories();
  const importRepo = useImportRepository();

  const importedIds = useMemo(
    () => new Set((imported.data ?? []).map((r) => r.github_id)),
    [imported.data],
  );

  const visible = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    const list = available.data ?? [];
    if (!term) return list;
    return list.filter((r) => r.name.toLowerCase().includes(term));
  }, [available.data, debouncedSearch]);

  function handleImport(repo: AvailableRepository) {
    importRepo.mutate(
      { github_id: repo.id, full_name: repo.name },
      {
        onSuccess: () => toast.success(`Imported ${repo.name}`),
        onError: (error) =>
          toast.error(
            error instanceof ApiError
              ? error.detail
              : `Couldn't import ${repo.name}`,
          ),
      },
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories…"
            className="pl-8"
            aria-label="Search repositories"
          />
        </div>
        <Select
          value={owner}
          onValueChange={(value) => setOwner(value as OwnerFilter)}
        >
          <SelectTrigger className="w-32" aria-label="Owner type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="user">Personal</SelectItem>
            <SelectItem value="org">Organization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="max-h-80 overflow-y-auto rounded-md border border-border">
        {available.isLoading ? (
          <div className="space-y-2 p-3" data-testid="loading-skeletons">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : available.isError ? (
          <div className="p-3">
            <ErrorAlert
              error={available.error}
              onRetry={() => available.refetch()}
            />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            className="border-0"
            icon={SearchIcon}
            title="No repositories found"
            description="Try a different search term or owner filter."
          />
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((repo) => {
              const alreadyImported = importedIds.has(repo.id);
              return (
                <li
                  key={repo.id}
                  className="flex items-center justify-between gap-3 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {repo.name}
                    </span>
                    {repo.private ? (
                      <LockIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : null}
                    {repo.language ? (
                      <Badge variant="secondary" className="shrink-0">
                        {repo.language}
                      </Badge>
                    ) : null}
                  </div>
                  {alreadyImported ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckIcon className="size-3.5" />
                      Imported
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={importRepo.isPending}
                      onClick={() => handleImport(repo)}
                    >
                      Import
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
