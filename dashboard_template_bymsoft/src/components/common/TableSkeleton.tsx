import React from "react";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns = 6, rows = 5 }) => {
  return (
    <div className="w-full animate-pulse">
      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="p-4 border-b">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
