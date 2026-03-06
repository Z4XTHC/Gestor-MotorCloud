import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Sin resultados",
  description = "No se encontraron registros.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="p-6 text-center text-gray-600">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <div>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
