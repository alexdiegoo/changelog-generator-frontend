"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { ToneBadge } from "@/components/shared/changelogs/tone-badge";
import { formatDateTime } from "@/lib/utils";
import type { Changelog } from "@/types/api";

export const changelogColumns: ColumnDef<Changelog>[] = [
  {
    accessorKey: "version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Version" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/changelogs/${row.original.id}`}
        className="font-medium hover:text-primary hover:underline"
      >
        {row.original.version ?? "Draft"}
      </Link>
    ),
  },
  {
    accessorKey: "tone",
    header: "Tone",
    enableSorting: false,
    cell: ({ row }) => <ToneBadge tone={row.original.tone} />,
  },
  {
    accessorKey: "language",
    header: "Language",
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.language}</Badge>
    ),
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.published_at ? (
        <Badge variant="default">
          <CheckCircle2Icon className="size-3" />
          Published
        </Badge>
      ) : row.original.edited ? (
        <Badge variant="secondary">Edited</Badge>
      ) : (
        <span className="text-muted-foreground">Draft</span>
      ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Generated" />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDateTime(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={`/changelogs/${row.original.id}`} />}
        >
          Open
        </Button>
      </div>
    ),
  },
];
