import React from "react";
import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  perPage?: number;
  onPerPageChange?: (n: number) => void;
  perPageOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  perPage = 10,
  onPerPageChange,
  perPageOptions = [5, 10, 25, 50],
}) => {
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Button onClick={prev} disabled={page <= 1} size="sm">
          Anterior
        </Button>
        <Button onClick={next} disabled={page >= totalPages} size="sm">
          Siguiente
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        Página {page} de {totalPages || 1}
      </div>

      {onPerPageChange && (
        <div className="flex items-center gap-2">
          <label className="text-sm">Mostrar</label>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {perPageOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
