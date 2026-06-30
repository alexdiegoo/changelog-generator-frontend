"use client";

import { useRouter } from "next/navigation";
import {
  FileTextIcon,
  GitPullRequestIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDisclosure } from "@/hooks/ui/use-disclosure";
import {
  useRemoveRepository,
  useSyncRepository,
} from "@/hooks/queries/use-repositories";
import { ApiError } from "@/lib/api/api-client";
import type { Repository } from "@/types/api";

export function RepositoryRowActions({ repository }: { repository: Repository }) {
  const router = useRouter();
  const confirm = useDisclosure();
  const sync = useSyncRepository(repository.id);
  const remove = useRemoveRepository();

  function handleSync() {
    sync.mutate(undefined, {
      onSuccess: (result) =>
        toast.success(
          result.new_pull_requests > 0
            ? `Synced — ${result.new_pull_requests} new pull request(s).`
            : "Synced — no new pull requests.",
        ),
      onError: (error) =>
        toast.error(error instanceof ApiError ? error.detail : "Sync failed."),
    });
  }

  function handleDelete() {
    remove.mutate(repository.id, {
      onSuccess: () => {
        toast.success(`Removed ${repository.full_name}`);
        confirm.close();
      },
      onError: (error) =>
        toast.error(
          error instanceof ApiError ? error.detail : "Couldn't remove repository.",
        ),
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Repository actions" />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => router.push(`/repositories/${repository.id}`)}
          >
            <GitPullRequestIcon />
            Pull requests
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/repositories/${repository.id}/changelogs`)
            }
          >
            <FileTextIcon />
            Changelog history
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSync} disabled={sync.isPending}>
            <RefreshCwIcon />
            {sync.isPending ? "Syncing…" : "Sync"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={confirm.open}>
            <Trash2Icon />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirm.isOpen} onOpenChange={confirm.setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove repository?</DialogTitle>
            <DialogDescription>
              This removes <strong>{repository.full_name}</strong> and its
              synced pull requests and changelogs from the app. Your GitHub data
              is untouched.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={remove.isPending}
            >
              {remove.isPending ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
