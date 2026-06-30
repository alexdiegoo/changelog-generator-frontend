"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changelogExportUrl } from "@/hooks/queries/use-changelogs";
import type { ExportFormat } from "@/types/api";

const FORMATS: { format: ExportFormat; label: string; download: boolean }[] = [
  { format: "md", label: "Markdown (.md)", download: true },
  { format: "json", label: "JSON", download: false },
  { format: "html", label: "HTML", download: false },
];

export function ExportMenu({ changelogId }: { changelogId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <DownloadIcon />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export as</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {FORMATS.map(({ format, label, download }) => (
            <DropdownMenuItem
              key={format}
              render={
                <a
                  href={changelogExportUrl(changelogId, format)}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...(download ? { download: "" } : {})}
                />
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
