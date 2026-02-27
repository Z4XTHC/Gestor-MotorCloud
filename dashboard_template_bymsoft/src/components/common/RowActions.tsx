import React from "react";
import { Eye, Edit3, Trash2 } from "lucide-react";
import { Button } from "./Button";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RowActions: React.FC<RowActionsProps> = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Button variant="ghost" size="sm" onClick={onView} title="Ver">
          <Eye className="w-4 h-4" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit} title="Editar">
          <Edit3 className="w-4 h-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={onDelete} title="Eliminar">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      )}
    </div>
  );
};

export default RowActions;
