import { useState } from "react";
import { Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "../../components/common/Button";
import {
  crearTecnico,
  actualizarTecnico,
  Tecnico,
} from "../../api/tecnicosApi";

interface TecnicoFormProps {
  tecnico?: Tecnico | null;
  onSaved?: (t: Tecnico) => void;
  onCancel?: () => void;
}

export const TecnicoForm = ({
  tecnico,
  onSaved,
  onCancel,
}: TecnicoFormProps) => {
  const isEditing = !!tecnico;
  const [form, setForm] = useState<Partial<Tecnico>>({
    nombre: tecnico?.nombre || "",
    apellido: tecnico?.apellido || "",
    email: tecnico?.email || "",
    telefono: tecnico?.telefono || "",
    cuit: tecnico?.cuit || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let saved: Tecnico;
      const id = tecnico?._id || tecnico?.id;
      if (id) {
        saved = await actualizarTecnico(id, form);
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Técnico actualizado exitosamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        saved = await crearTecnico(form);
        Swal.fire({
          icon: "success",
          title: "Creado",
          text: "Técnico creado exitosamente",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      onSaved?.(saved);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo ${tecnico ? "actualizar" : "crear"} el técnico`,
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-neutral-light dark:border-dark-bg p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              {isEditing ? "Editar Técnico" : "Nuevo Técnico"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={saving}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Apellido
            </label>
            <input
              name="apellido"
              value={form.apellido || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              name="telefono"
              value={form.telefono || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              CUIT
            </label>
            <input
              name="cuit"
              value={form.cuit || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              disabled={saving}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-light dark:border-dark-bg">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={saving}
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
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Crear Técnico"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
