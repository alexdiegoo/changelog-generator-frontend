"use client";

import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSyncRepository } from "@/hooks/queries/use-repositories";
import { ApiError } from "@/lib/api/api-client";
import { cn } from "@/lib/utils";

interface SyncRepositoryButtonProps {
  repoId: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm";
  className?: string;
}

export function SyncRepositoryButton({
  repoId,
  variant = "outline",
  size = "default",
  className,
}: SyncRepositoryButtonProps) {
  const sync = useSyncRepository(repoId);

  function handleSync() {
    sync.mutate(undefined, {
      onSuccess: (result) =>
        toast.success(
          result.new_pull_requests > 0
            ? `Synced — ${result.new_pull_requests} new pull request(s).`
            : "Synced — no new pull requests.",
        ),
      onError: (error) =>
        toast.error(
          error instanceof ApiError ? error.detail : "Sync failed.",
        ),
    });
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSync}
      disabled={sync.isPending}
      className={className}
    >
      <RefreshCwIcon className={cn(sync.isPending && "animate-spin")} />
      {sync.isPending ? "Syncing…" : "Sync"}
    </Button>
  );
}
