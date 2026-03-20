import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  label?: string;
}

interface TableProps<T> {
  columns: Column[];
  data: T[];
  loading: boolean;
  search?: string;
  isFiltering?: boolean;
  emptyMessage?: string | ((search: string, isFiltering: boolean) => string);
  renderRow: (item: T, index: number) => React.ReactNode;
  onSort?: (key: string) => void;
  getSortIcon?: (key: string) => React.ReactNode;
  pagination?: PaginationProps;
  emptyIcon?: React.ReactNode;
}

export function Table<T>({
  columns,
  data,
  loading,
  search,
  isFiltering,
  emptyMessage,
  renderRow,
  onSort,
  getSortIcon,
  pagination,
  emptyIcon,
}: TableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.itemsPerPage)
    : 0;
  const startIndex = pagination
    ? (pagination.currentPage - 1) * pagination.itemsPerPage
    : 0;
  const endIndex = pagination
    ? Math.min(startIndex + pagination.itemsPerPage, pagination.totalItems)
    : 0;

  const resolvedEmptyMessage =
    typeof emptyMessage === "function"
      ? emptyMessage(search || "", isFiltering || false)
      : emptyMessage;

  return (
    <>
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => col.sortable && onSort?.(col.key)}
                    className={`px-6 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                          ? "text-center"
                          : "text-left"
                    } ${
                      col.sortable
                        ? "cursor-pointer select-none hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1 ${
                        col.align === "center"
                          ? "justify-center"
                          : col.align === "right"
                            ? "justify-end"
                            : ""
                      }`}
                    >
                      {col.label}
                      {col.sortable && getSortIcon?.(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-14 text-center"
                  >
                    {emptyIcon && (
                      <div className="flex justify-center mb-4">
                        {emptyIcon}
                      </div>
                    )}
                    <p className="text-neutral-500 dark:text-neutral-400">
                      {resolvedEmptyMessage || "No se encontraron registros"}
                    </p>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                  >
                    {renderRow(item, index)}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && !loading && data.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Mostrando{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              {startIndex + 1}
            </span>{" "}
            a{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              {endIndex}
            </span>{" "}
            de{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              {pagination.totalItems}
            </span>{" "}
            {pagination.label || "registros"}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                pagination.setCurrentPage(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-neutral-600 dark:text-neutral-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    totalPages <= 7 ||
                    page === 1 ||
                    page === totalPages ||
                    (page >= pagination.currentPage - 1 &&
                      page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => pagination.setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          pagination.currentPage === page
                            ? "bg-primary-600 text-white"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-1 text-neutral-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                },
              )}
            </div>

            <button
              onClick={() =>
                pagination.setCurrentPage(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === totalPages}
              className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-neutral-600 dark:text-neutral-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
