// =============================================================
// PLANTILLA: Modal de detalles (solo lectura)
// =============================================================
// PASOS PARA ADAPTAR:
//  1. Reemplazar "Entidad" / "entidad" por el nombre real
//  2. Reemplazar "EntidadType" por el tipo TypeScript real
//  3. Cambiar el icono del modal (prop `icon` en <Modal>)
//  4. Cambiar title del <Modal> al nombre de la entidad
//  5. Agregar / quitar secciones y campos según la entidad
//  6. maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
// =============================================================

import { Edit, User } from "lucide-react"; // [TODO] Cambiar icono si lo deseas
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

// [TODO] Importar tipo real
// import { EntidadType } from "../../types/entidad";

// [TODO] Renombrar interfaz y props
interface EntidadDetallesProps {
  entidad: any | null; // [TODO] Tipado: EntidadType | null
  onClose: () => void;
  onEdit?: (entidad: any) => void; // [OPCIONAL] Quitar si no hay botón editar
}

// [TODO] Renombrar componente: EntidadDetalles
export const EntidadDetalles = ({
  entidad,
  onClose,
  onEdit,
}: EntidadDetallesProps) => {
  if (!entidad) return null;

  return (
    <Modal
      isOpen={!!entidad}
      onClose={onClose}
      // [TODO] Cambiar title e icon según la entidad
      title={`${entidad.campo1} ${entidad.campo2 ?? ""}`.trim()}
      icon={<User className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
      maxWidth="lg" // [TODO] Ajustar ancho según cantidad de campos
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {/* [OPCIONAL] Botón editar - eliminar si no se necesita */}
          {onEdit && (
            <Button
              icon={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(entidad)}
            >
              Editar
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* === SECCIÓN PRINCIPAL === */}
        {/* Duplicar este bloque para agregar más secciones (ej: Contacto, Ubicación) */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide">
            Información General {/* [TODO] Título de la sección */}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* --- Campo de texto plano --- */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                ID
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {entidad.id}
              </p>
            </div>

            {/* --- Otro campo de texto --- */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Campo 1 {/* [TODO] Etiqueta real */}
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {entidad.campo1}
              </p>
            </div>

            {/* [OPCIONAL] Campo con valor por defecto "-" si está vacío */}
            {/* <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Campo 2</p>
              <p className="text-sm text-neutral-900 dark:text-white">{entidad.campo2 || "-"}</p>
            </div> */}

            {/* [OPCIONAL] Campo con badge de tipo / categoría */}
            {/* Colores: green, yellow, red, blue, purple */}
            {/* <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Tipo</p>
              <span className={
                entidad.tipo === "VALOR_A"
                  ? "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                  : "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
              }>
                {entidad.tipo === "VALOR_A" ? "Tipo A" : "Tipo B"}
              </span>
            </div> */}

            {/* [OPCIONAL] Badge de estado activo/inactivo */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Estado
              </p>
              <span
                className={
                  entidad.status
                    ? "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${entidad.status ? "bg-green-500" : "bg-red-500"}`}
                />
                {entidad.status ? "Activo" : "Inactivo"}
              </span>
            </div>

            {/* [OPCIONAL] Campo de ancho completo con md:col-span-2 */}
            {/* <div className="md:col-span-2">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-sm text-neutral-900 dark:text-white">{entidad.descripcion || "-"}</p>
            </div> */}
          </div>
        </div>

        {/* [OPCIONAL] Segunda sección */}
        {/* <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            ...campos...
          </div>
        </div> */}
      </div>
    </Modal>
  );
};
