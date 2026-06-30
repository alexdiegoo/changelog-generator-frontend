"use client";

import { ExternalLinkIcon, RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Changelog } from "@/types/api";

export function PublishButton({ changelog }: { changelog: Changelog }) {
  // Already published — link straight to the GitHub Release.
  if (changelog.github_release_url) {
    return (
      <Button
        variant="outline"
        render={
          <a
            href={changelog.github_release_url}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <ExternalLinkIcon />
        View release
      </Button>
    );
  }

  // Publishing as a GitHub Release is not available yet — coming in a future release.
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          // Wrapper span: a disabled button doesn't emit the hover events the tooltip needs.
          <span className="inline-block" />
        }
      >
        <Button disabled aria-disabled className="pointer-events-none">
          <RocketIcon />
          Publish as Release
        </Button>
      </TooltipTrigger>
      <TooltipContent>Coming soon</TooltipContent>
    </Tooltip>
  );
}
