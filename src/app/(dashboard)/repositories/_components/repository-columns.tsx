"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { formatDate } from "@/lib/utils";
import type { Repository } from "@/types/api";
import { RepositoryRowActions } from "./repository-row-actions";

export const repositoryColumns: ColumnDef<Repository>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Repository" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/repositories/${row.original.id}`}
        className="font-medium hover:text-primary hover:underline"
      >
        {row.original.full_name}
      </Link>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Imported" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RepositoryRowActions repository={row.original} />
      </div>
    ),
  },
];
