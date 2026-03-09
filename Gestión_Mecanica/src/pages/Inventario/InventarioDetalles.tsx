import { Edit, Package } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Inventario } from "../../types/inventario";

interface InventarioDetallesProps {
  inventario: Inventario | null;
  onClose: () => void;
  onEdit?: (inventario: Inventario) => void;
}

export const InventarioDetalles = ({
  inventario,
  onClose,
  onEdit,
}: InventarioDetallesProps) => {
  if (!inventario) return null;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Sin Stock", color: "red" };
    if (stock <= 5) return { label: "Stock Crítico", color: "red" };
    if (stock <= 10) return { label: "Stock Bajo", color: "yellow" };
    return { label: "Stock OK", color: "green" };
  };

  const stockStatus = getStockStatus(inventario.stock);

  return (
    <Modal
      isOpen={!!inventario}
      onClose={onClose}
      title={inventario.nombre}
      icon={<Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {onEdit && (
            <Button
              icon={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(inventario)}
            >
              Editar
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Información General */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide">
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">ID</p>
              <p className="text-sm text-neutral-900 dark:text-white">{inventario.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Estado</p>
              <span className={inventario.status
                ? "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }>
                <div className={`w-1.5 h-1.5 rounded-full ${inventario.status ? "bg-green-500" : "bg-red-500"}`} />
                {inventario.status ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-sm text-neutral-900 dark:text-white">{inventario.descripcion || "-"}</p>
            </div>
          </div>
        </div>

        {/* Stock y Precios */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide">
            Stock y Precios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Stock Actual</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{inventario.stock} unidades</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${stockStatus.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}
                  ${stockStatus.color === "yellow" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" : ""}
                  ${stockStatus.color === "red" ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" : ""}
                `}>
                  {stockStatus.label}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Precio de Venta</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">${inventario.precio.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Costo</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">${inventario.costo.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
