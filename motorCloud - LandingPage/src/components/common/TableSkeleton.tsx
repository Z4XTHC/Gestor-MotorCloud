import React from "react";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 6,
  rows = 5,
}) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-6 py-3.5">
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center">
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className="flex-1 px-6 py-4">
                {c === 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-neutral-200 dark:bg-neutral-700 rounded w-28" />
                      <div className="h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded w-16" />
                    </div>
                  </div>
                ) : (
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
