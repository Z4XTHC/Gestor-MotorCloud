// =============================================================
// PLANTILLA: Formulario de creación y edición (modal)
// =============================================================
// PASOS PARA ADAPTAR:
//  1. Reemplazar "Entidad" / "entidad" por el nombre real
//  2. Reemplazar "EntidadType" por el tipo TypeScript real
//  3. Cambiar los imports de API (crearXxx, actualizarXxx)
//  4. Definir formData con los campos del formulario
//  5. Ajustar el useEffect de precarga de datos (modo edición)
//  6. Construir el payload del handleSubmit con los campos reales
//  7. Agregar / quitar campos del formulario según la entidad
//  8. Campos disponibles: Input (texto/número/etc), SearchableSelect (opciones)
//  9. [OPCIONAL] Eliminar bloque de contraseña si no aplica
// =============================================================

import { useState, useEffect } from "react";
import { Edit, Plus, Eye, EyeOff } from "lucide-react";  // [OPCIONAL] Eye/EyeOff solo para password
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { SearchableSelect } from "../common/SearchableSelect";
import { showSuccess, showError } from "../common/SweetAlert";

// [TODO] Importar tipo y funciones de API
// import { EntidadType } from "../../types/entidad";
// import { crearEntidad, actualizarEntidad } from "../../api/entidadApi";

// [TODO] Renombrar interfaz y props
interface EntidadFormProps {
  entidad?: any | null;  // [TODO] Tipado: EntidadType | null
  onClose: () => void;
  onSuccess: () => void;
}

// [TODO] Renombrar componente: EntidadForm
export const EntidadForm = ({
  entidad,
  onClose,
  onSuccess,
}: EntidadFormProps) => {
  const isEditing = !!entidad;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // [OPCIONAL] Solo si hay campo password

  // [TODO] Definir campos del formulario con valores iniciales
  const [formData, setFormData] = useState({
    campo1: "",         // [TODO] Renombrar con campos reales
    campo2: "",
    selectField: "",    // [OPCIONAL] Para campos tipo select
    // password: "",    // [OPCIONAL] Solo si hay contraseña
    status: true,       // [OPCIONAL] Solo si hay estado activo/inactivo
  });

  // Precarga de datos al editar
  useEffect(() => {
    if (isEditing && entidad) {
      // [TODO] Mapear cada campo del objeto al formData
      setFormData({
        campo1: entidad.campo1 || "",
        campo2: entidad.campo2 || "",
        selectField: entidad.selectField || "",
        // password: "",       // Siempre vacío en edición
        status: entidad.status ?? true,
      });
    }
  }, [entidad, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // [TODO] Construir payload con los campos necesarios para el backend
      const payload: Record<string, unknown> = {
        campo1: formData.campo1,
        campo2: formData.campo2,
        selectField: formData.selectField,
        status: formData.status,
      };

      // [OPCIONAL] Solo incluir password si tiene valor (en edición)
      // if (formData.password) payload.password = formData.password;

      if (isEditing && entidad) {
        // [TODO] await actualizarEntidad(String(entidad.id), payload);
        showSuccess("Actualizado", "Registro actualizado exitosamente");
      } else {
        // [TODO] await crearEntidad(payload);
        showSuccess("Creado", "Registro creado exitosamente");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      showError("Error", `No se pudo ${isEditing ? "actualizar" : "crear"} el registro`);
    } finally {
      setLoading(false);
    }
  };

  // [OPCIONAL] Opciones para campos tipo SearchableSelect
  // const campo3Options = [
  //   { value: "OPCION_A", label: "Opción A" },
  //   { value: "OPCION_B", label: "Opción B" },
  // ];

  const estadoOptions = [  // [OPCIONAL] Solo si hay estado
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

        {/* === HEADER DEL MODAL === */}
        <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-neutral-light dark:border-dark-bg p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              {/* [TODO] Cambiar texto */}
              {isEditing ? "Editar Entidad" : "Nueva Entidad"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* === CUERPO DEL FORMULARIO === */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* --- Campo de texto simple --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Campo 1 * {/* [TODO] Etiqueta real, quitar * si no es requerido */}
              </label>
              <Input
                type="text"
                value={formData.campo1}
                onChange={(e) => setFormData({ ...formData, campo1: e.target.value })}
                required      // [TODO] Quitar si no es obligatorio
                disabled={loading}
              />
            </div>

            {/* --- Campo de texto secundario --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Campo 2 {/* [TODO] Sin asterisco = opcional */}
              </label>
              <Input
                type="text"
                value={formData.campo2}
                onChange={(e) => setFormData({ ...formData, campo2: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* --- Campo de ancho completo --- */}
            {/* Usar md:col-span-2 para que ocupe toda la fila */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Campo Largo *
              </label>
              <Input type="text" value={formData.campo1} onChange={...} required disabled={loading} />
            </div> */}

            {/* [OPCIONAL] Campo de contraseña con toggle de visibilidad */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {isEditing ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña *"}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditing}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div> */}

            {/* --- Select con búsqueda (enum / lista fija) --- */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Field *
              </label>
              <SearchableSelect
                options={campo3Options}
                value={formData.selectField}
                onChange={(val) => setFormData({ ...formData, selectField: val })}
                placeholder="Seleccione..."
                disabled={loading}
              />
            </div> */}

            {/* [OPCIONAL] Campo de estado activo/inactivo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Estado *
              </label>
              <SearchableSelect
                options={estadoOptions}
                value={String(formData.status)}
                onChange={(val) => setFormData({ ...formData, status: val === "true" })}
                placeholder="Seleccione un estado"
                disabled={loading}
              />
            </div>

          </div>

          {/* === BOTONES === */}
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-light dark:border-dark-bg">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              icon={isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              disabled={loading}
            >
              {/* [TODO] Ajustar textos */}
              {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Registro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
