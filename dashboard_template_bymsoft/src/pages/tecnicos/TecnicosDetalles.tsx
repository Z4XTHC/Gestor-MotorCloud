import { Edit } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Tecnico } from "../../api/tecnicosApi";
import DetallesModal from "../../components/common/DetallesModal";

interface TecnicosDetallesProps {
  tecnico: Tecnico | null;
  onClose: () => void;
  onEdit?: (tecnico: Tecnico) => void;
}

export const TecnicosDetalles = ({
  tecnico,
  onClose,
  onEdit,
}: TecnicosDetallesProps) => {
  if (!tecnico) return null;
  const headerContent = (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
        {tecnico.nombre} {tecnico.apellido || ""}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        {tecnico.email || "Sin email"}
      </p>
    </div>
  );

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cerrar
      </Button>
      {onEdit && (
        <Button
          icon={<Edit className="w-4 h-4" />}
          onClick={() => onEdit(tecnico)}
        >
          Editar
        </Button>
      )}
    </>
  );

  return (
    <DetallesModal
      headerContent={headerContent}
      footer={footer}
      onClose={onClose}
      maxWidthClass="max-w-md"
      contentClassName="p-6"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Apellido
          </label>
          <p className="text-gray-900 dark:text-dark-text">
            {tecnico.apellido || "-"}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            CUIT
          </label>
          <p className="text-gray-900 dark:text-dark-text">
            {tecnico.cuit || "-"}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Teléfono
          </label>
          <p className="text-gray-900 dark:text-dark-text">
            {tecnico.telefono || "Sin teléfono"}
          </p>
        </div>
        {tecnico.createdAt && (
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Fecha de registro
            </label>
            <p className="text-gray-900 dark:text-dark-text">
              {new Date(tecnico.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </DetallesModal>
  );
};
