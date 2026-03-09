import { useState, useEffect } from "react";
import { Edit, Plus, Package } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { showSuccess, showError } from "../../components/common/SweetAlert";
import {
  Inventario,
  CreateInventarioRequest,
  UpdateInventarioRequest,
} from "../../types/inventario";
import {
  crearItemInventario,
  actualizarItemInventario,
} from "../../api/inventarioApi";

interface InventarioFormProps {
  inventario?: Inventario | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const InventarioForm = ({
  inventario,
  onClose,
  onSuccess,
}: InventarioFormProps) => {
  const isEditing = !!inventario;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    codigo: "",
    stock: 0,
    precio: 0,
    costo: 0,
    status: true,
  });

  useEffect(() => {
    if (isEditing && inventario) {
      setFormData({
        nombre: inventario.nombre || "",
        descripcion: inventario.descripcion || "",
        codigo: inventario.codigo || "",
        stock: inventario.stock ?? 0,
        precio: inventario.precio ?? 0,
        costo: inventario.costo ?? 0,
        status: inventario.status ?? true,
      });
    }
  }, [inventario, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && inventario) {
        const payload: UpdateInventarioRequest = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          codigo: formData.codigo,
          stock: Number(formData.stock),
          precio: Number(formData.precio),
          costo: Number(formData.costo),
          status: formData.status,
        };
        await actualizarItemInventario(String(inventario.id), payload);
        showSuccess("Actualizado", "Repuesto actualizado exitosamente.");
      } else {
        const payload: CreateInventarioRequest = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          codigo: formData.codigo,
          stock: Number(formData.stock),
          precio: Number(formData.precio),
          costo: Number(formData.costo),
          status: formData.status,
        };
        await crearItemInventario(payload);
        showSuccess("Creado", "Repuesto agregado exitosamente.");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      showError(
        "Error",
        `No se pudo ${isEditing ? "actualizar" : "crear"} el repuesto.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const estadoOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Información del Repuesto */}
        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-500" />
            Información del Repuesto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Código de Barra *
              </label>
              <Input
                type="text"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
                placeholder="Ej: COD12345"
                required
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nombre *
              </label>
              <Input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej: Filtro de Aceite"
                required
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Descripción del repuesto..."
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Stock y Precios */}
        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
            Stock y Precios
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Stock Inicial *
              </label>
              <Input
                type="number"
                value={String(formData.stock)}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                placeholder="0"
                min="0"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Estado *
              </label>
              <SearchableSelect
                options={estadoOptions}
                value={String(formData.status)}
                onChange={(val) =>
                  setFormData({ ...formData, status: val === "true" })
                }
                placeholder="Seleccione un estado"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Precio de Venta *
              </label>
              <Input
                type="number"
                value={String(formData.precio)}
                onChange={(e) =>
                  setFormData({ ...formData, precio: Number(e.target.value) })
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Costo *
              </label>
              <Input
                type="number"
                value={String(formData.costo)}
                onChange={(e) =>
                  setFormData({ ...formData, costo: Number(e.target.value) })
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          icon={
            isEditing ? (
              <Edit className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )
          }
          loading={loading}
          className="flex-1 bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          {isEditing ? "Guardar Cambios" : "Agregar Repuesto"}
        </Button>
      </div>
    </form>
  );
};
