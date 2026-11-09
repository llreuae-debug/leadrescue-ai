import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";

export interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching your current filters.",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("linear-card overflow-hidden", className)}>
        <LoadingState type="skeleton" rows={5} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("linear-card p-4", className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={cn("linear-card overflow-hidden flex flex-col justify-between", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "py-3 px-4 font-semibold text-slate-700 tracking-wide uppercase text-[11px]",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.className
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex items-center gap-1",
                      col.align === "right" && "justify-end",
                      col.align === "center" && "justify-center"
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ChevronsUpDown className="w-3 h-3 text-slate-400 hover:text-slate-700 cursor-pointer" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "py-3 px-4 text-slate-700 align-middle",
                      col.align === "right" && "text-right tabular-nums",
                      col.align === "center" && "text-center",
                      col.className
                    )}
                  >
                    {col.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800 font-semibold">{currentPage}</strong> of{" "}
            <strong className="text-slate-800 font-semibold">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
