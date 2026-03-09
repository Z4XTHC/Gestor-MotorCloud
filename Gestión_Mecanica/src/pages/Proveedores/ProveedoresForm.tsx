// =============================================================
// PLANTILLA: Formulario de creación y edición (dentro de Modal)
// =============================================================
// PASOS PARA ADAPTAR:
//  1. Reemplazar "Entidad" / "entidad" por el nombre real
//  2. Reemplazar "EntidadType" por el tipo TypeScript real
//  3. Cambiar el icono del modal (prop `icon` en el padre)
//  4. Cambiar los imports de API (crearXxx, actualizarXxx)
//  5. Definir formData con los campos del formulario
//  6. Ajustar el useEffect de precarga (modo edición)
//  7. Construir el payload del handleSubmit con los campos reales
//  8. Agregar / quitar campos del formulario según la entidad
//  9. Para usar este form dentro de Modal:
//        <Modal isOpen={...} onClose={...} title="Nueva Entidad"
//               icon={<IconX className="w-5 h-5 text-primary-600" />}
//               maxWidth="lg" noPadding>
//          <EntidadForm onClose={...} onSuccess={...} />
//        </Modal>
// =============================================================

import { useState, useEffect } from "react";
import { Edit, Plus, Eye, EyeOff } from "lucide-react"; // [OPCIONAL] Eye/EyeOff solo para password
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { SearchableSelect } from "../common/SearchableSelect";
import { showSuccess, showError } from "../common/SweetAlert";

// [TODO] Importar tipo y funciones de API
// import { EntidadType } from "../../types/entidad";
// import { crearEntidad, actualizarEntidad } from "../../api/entidadApi";

// [TODO] Renombrar interfaz y props
interface EntidadFormProps {
  entidad?: any | null; // [TODO] Tipado: EntidadType | null
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
    campo1: "", // [TODO] Renombrar con campos reales
    campo2: "",
    selectField: "", // [OPCIONAL] Para campos tipo select
    // password: "", // [OPCIONAL] Solo si hay contraseña
    status: true, // [OPCIONAL] Solo si hay estado activo/inactivo
  });

  // Precarga de datos al editar
  useEffect(() => {
    if (isEditing && entidad) {
      // [TODO] Mapear cada campo del objeto al formData
      setFormData({
        campo1: entidad.campo1 || "",
        campo2: entidad.campo2 || "",
        selectField: entidad.selectField || "",
        // password: "",  // Siempre vacío en edición
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
      showError(
        "Error",
        `No se pudo ${isEditing ? "actualizar" : "crear"} el registro`,
      );
    } finally {
      setLoading(false);
    }
  };

  // [OPCIONAL] Opciones para SearchableSelect
  // const campo3Options = [
  //   { value: "OPCION_A", label: "Opción A" },
  //   { value: "OPCION_B", label: "Opción B" },
  // ];

  const estadoOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  // ============================================================
  // ESTRUCTURA: form flex-col (se monta dentro de <Modal noPadding>)
  // El header y el scroll los maneja el componente Modal.
  // ============================================================
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* === CUERPO SCROLLABLE === */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* --- Sección de campos --- */}
        {/* Duplicar <section> para agregar más secciones */}
        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            {/* [TODO] Icono + Título de sección */}
            {/* <IconX className="w-4 h-4" /> */}
            Información General
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* --- Campo de texto simple --- */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Campo 1 *
              </label>
              <Input
                type="text"
                value={formData.campo1}
                onChange={(e) =>
                  setFormData({ ...formData, campo1: e.target.value })
                }
                placeholder="Ingrese valor..."
                required
                disabled={loading}
              />
            </div>

            {/* --- Campo de texto secundario --- */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Campo 2 {/* [TODO] Sin asterisco = opcional */}
              </label>
              <Input
                type="text"
                value={formData.campo2}
                onChange={(e) =>
                  setFormData({ ...formData, campo2: e.target.value })
                }
                placeholder="Ingrese valor..."
                disabled={loading}
              />
            </div>

            {/* [OPCIONAL] Campo ancho completo con md:col-span-2 */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={formData.campo1}
                onChange={(e) => setFormData({ ...formData, campo1: e.target.value })}
                placeholder="Describe..."
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div> */}

            {/* [OPCIONAL] Campo contraseña con toggle de visibilidad */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div> */}

            {/* [OPCIONAL] Select con búsqueda (enum / lista fija) */}
            {/* <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
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

            {/* [OPCIONAL] Estado activo/inactivo */}
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
          </div>
        </section>

        {/* [OPCIONAL] Segunda sección */}
        {/* <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
            Otra Sección
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            ...campos...
          </div>
        </section> */}
      </div>

      {/* === FOOTER CON BOTONES (sticky al fondo del modal) === */}
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
          className="flex-1"
        >
          {/* [TODO] Ajustar textos */}
          {isEditing ? "Guardar Cambios" : "Crear Registro"}
        </Button>
      </div>
    </form>
  );
};
