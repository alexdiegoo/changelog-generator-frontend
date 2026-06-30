"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableSkeleton } from "./data-table-skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  /** Stable row id (needed for selection to survive re-renders/refetches). */
  getRowId?: (row: TData) => string;
  /** Controlled row selection (for multi-select tables like the PR picker). */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Renders a node when there is no data; falls back to `emptyMessage`. */
  emptyState?: React.ReactNode;
  /** Receives the table instance (e.g. for an external "select all" summary). */
  onTableReady?: (table: TanstackTable<TData>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  emptyMessage = "No results found.",
  getRowId,
  rowSelection,
  onRowSelectionChange,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: rowSelection ? { rowSelection } : undefined,
    onRowSelectionChange:
      rowSelection && onRowSelectionChange
        ? (updater) =>
            onRowSelectionChange(
              typeof updater === "function" ? updater(rowSelection) : updater,
            )
        : undefined,
    enableRowSelection: !!rowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) return <DataTableSkeleton columns={columns.length} />;

  const rows = table.getRowModel().rows;

  if (!rows.length && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className={cn(row.getIsSelected() && "bg-muted/50")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
