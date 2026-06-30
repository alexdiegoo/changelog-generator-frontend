"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { formatDate } from "@/lib/utils";
import type { PullRequest } from "@/types/api";

export const pullRequestColumns: ColumnDef<PullRequest>[] = [
  {
    id: "select",
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(checked === true)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select PR #${row.original.number}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
      />
    ),
  },
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-muted-foreground">
        #{row.original.number}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.author}</span>
    ),
  },
  {
    accessorKey: "labels",
    header: "Labels",
    enableSorting: false,
    cell: ({ row }) => {
      const labels = row.original.labels ?? [];
      if (labels.length === 0)
        return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {labels.slice(0, 3).map((label) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
          {labels.length > 3 ? (
            <Badge variant="outline">+{labels.length - 3}</Badge>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "merged_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merged" />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(row.original.merged_at)}
      </span>
    ),
  },
];
