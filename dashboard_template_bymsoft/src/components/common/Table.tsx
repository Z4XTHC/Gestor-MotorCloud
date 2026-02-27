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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-neutral-light dark:bg-dark-bg rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    const resolvedEmptyMessage =
      typeof emptyMessage === "function"
        ? emptyMessage(search || "", isFiltering || false)
        : emptyMessage;

    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {resolvedEmptyMessage || "No se encontraron registros"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-light dark:border-dark-bg">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`px-4 py-4 font-semibold text-sm text-gray-900 dark:text-dark-text ${
                    col.align === "center" ? "text-center" : "text-left"
                  } ${
                    col.sortable
                      ? "cursor-pointer select-none hover:bg-primary-lighter/70 dark:hover:bg-dark-surface transition-colors"
                      : ""
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      col.align === "center" ? "justify-center" : ""
                    }`}
                  >
                    {col.label}
                    {col.sortable && getSortIcon?.(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-neutral-light dark:border-dark-bg hover:bg-primary-lighter/30 dark:hover:bg-dark-bg transition-colors ${
                  index % 2 === 0
                    ? "bg-warm-light/50 dark:bg-dark-surface"
                    : "bg-white dark:bg-dark-bg"
                }`}
              >
                {renderRow(item, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-6 flex items-center justify-between border-t border-neutral-light dark:border-dark-bg pt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1} a {endIndex} de {pagination.totalItems}{" "}
            {pagination.label || "registros"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                pagination.setCurrentPage(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 border border-neutral-light dark:border-dark-bg rounded-lg hover:bg-primary-lighter dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-dark-text"
            >
              <ChevronLeft className="w-5 h-5" />
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
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          pagination.currentPage === page
                            ? "bg-primary text-white dark:bg-dark-primary"
                            : "hover:bg-primary-lighter dark:hover:bg-dark-bg text-gray-900 dark:text-dark-text"
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
                      <span
                        key={page}
                        className="px-2 text-gray-400 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            <button
              onClick={() =>
                pagination.setCurrentPage(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === totalPages}
              className="px-3 py-2 border border-neutral-light dark:border-dark-bg rounded-lg hover:bg-primary-lighter dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-dark-text"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
