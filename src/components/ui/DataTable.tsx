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
      <div className={cn("rounded-2xl border-2 border-[#DCDDDA] bg-white overflow-hidden p-6", className)}>
        <LoadingState type="skeleton" rows={5} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-2xl border-2 border-[#DCDDDA] bg-white p-8", className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-[#DCDDDA] bg-white overflow-hidden flex flex-col justify-between shadow-[0_2px_0_0_#DCDDDA]",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-[#DCDDDA] bg-[#F3F4F2]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "py-3.5 px-4 font-bold text-[#202320] tracking-wider uppercase text-[11px]",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.className
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5",
                      col.align === "right" && "justify-end",
                      col.align === "center" && "justify-center"
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#777D77] hover:text-[#101113] cursor-pointer" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDDDA]/70">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-[#F3F4F2]/60 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "py-3.5 px-4 text-[#202320] align-middle font-medium",
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
        <div className="flex items-center justify-between px-5 py-3.5 border-t-2 border-[#DCDDDA] bg-[#F3F4F2]/60 text-xs text-[#777D77]">
          <div>
            Page <strong className="text-[#101113] font-bold">{currentPage}</strong> of{" "}
            <strong className="text-[#101113] font-bold">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border-1.5 border-[#DCDDDA] bg-white text-[#202320] hover:border-[#101113] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border-1.5 border-[#DCDDDA] bg-white text-[#202320] hover:border-[#101113] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
