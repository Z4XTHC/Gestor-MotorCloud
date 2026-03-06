// =============================================================
// PLANTILLA: Modal de detalles (solo lectura)
// =============================================================
// PASOS PARA ADAPTAR:
//  1. Reemplazar "Entidad" / "entidad" por el nombre real
//  2. Reemplazar "EntidadType" por el tipo TypeScript real
//  3. Cambiar el icono del header (actualmente User de lucide-react)
//  4. Ajustar title/subtitle del header al nombre de la entidad
//  5. Agregar / quitar secciones y campos según la entidad
//  6. Cambiar colores de badges si aplica
//  7. maxWidthClass: "max-w-sm" | "max-w-md" | "max-w-lg" | "max-w-2xl" | "max-w-4xl"
// =============================================================

import { Edit, User } from "lucide-react";  // [TODO] Cambiar icono si lo deseas
import { Button } from "../common/Button";
import DetallesModal from "../common/DetallesModal";

// [TODO] Importar tipo real
// import { EntidadType } from "../../types/entidad";

// [TODO] Renombrar interfaz y props
interface EntidadDetallesProps {
  entidad: any | null;   // [TODO] Tipado: EntidadType | null
  onClose: () => void;
  onEdit?: (entidad: any) => void;  // [OPCIONAL] Quitar si no hay botón editar
}

// [TODO] Renombrar componente: EntidadDetalles
export const EntidadDetalles = ({
  entidad,
  onClose,
  onEdit,
}: EntidadDetallesProps) => {
  if (!entidad) return null;

  // === FOOTER DEL MODAL ===
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cerrar
      </Button>
      {/* [OPCIONAL] Botón editar - eliminar si no se necesita acción directa desde detalles */}
      {onEdit && (
        <Button icon={<Edit className="w-4 h-4" />} onClick={() => onEdit(entidad)}>
          Editar
        </Button>
      )}
    </>
  );

  // === HEADER DEL MODAL ===
  const headerContent = (
    <div className="flex items-center gap-4">
      {/* [TODO] Puedes usar una imagen si la entidad la tiene:
          {entidad.imagen ? (
            <img src={entidad.imagen} alt={entidad.campo1} className="w-12 h-12 object-contain rounded-lg" />
          ) : ( */}
      <div className="w-12 h-12 bg-primary-lighter dark:bg-dark-bg rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-primary dark:text-dark-primary" /> {/* [TODO] Cambiar icono */}
      </div>
      {/* )} */}
      <div>
        {/* [TODO] Título principal: nombre o campo representativo */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
          {entidad.campo1} {entidad.campo2}
        </h2>
        {/* [TODO] Subtítulo: ID, username, código, etc. */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          #{entidad.id}
        </p>
      </div>
    </div>
  );

  return (
    <DetallesModal
      headerContent={headerContent}
      onClose={onClose}
      footer={footer}
      maxWidthClass="max-w-lg"         {/* [TODO] Ajustar ancho según cantidad de campos */}
      contentClassName="p-6"
    >
      <div className="space-y-6">

        {/* === SECCIÓN PRINCIPAL === */}
        {/* Duplicar este bloque para agregar más secciones (ej: Contacto, Ubicación, etc.) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            Información General {/* [TODO] Título de la sección */}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* --- Campo de texto plano --- */}
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                ID
              </label>
              <p className="text-gray-900 dark:text-dark-text">{entidad.id}</p>
            </div>

            {/* --- Otro campo de texto --- */}
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Campo 1 {/* [TODO] Etiqueta real */}
              </label>
              <p className="text-gray-900 dark:text-dark-text">{entidad.campo1}</p>
            </div>

            {/* [OPCIONAL] Campo con valor por defecto "-" si está vacío */}
            {/* <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Campo 2</label>
              <p className="text-gray-900 dark:text-dark-text">{entidad.campo2 || "-"}</p>
            </div> */}

            {/* [OPCIONAL] Campo con badge de tipo / categoría */}
            {/* Colores disponibles: purple, blue, green, red, yellow, gray */}
            {/* <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tipo</label>
              <p>
                <span className={
                  entidad.tipo === "VALOR_A"
                    ? "inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : "inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }>
                  {entidad.tipo === "VALOR_A" ? "Tipo A" : "Tipo B"}
                </span>
              </p>
            </div> */}

            {/* [OPCIONAL] Badge de estado activo/inactivo */}
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</label>
              <p>
                <span className={
                  entidad.status
                    ? "inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }>
                  {entidad.status ? "Activo" : "Inactivo"}
                </span>
              </p>
            </div>

            {/* [OPCIONAL] Ocupar columna completa con md:col-span-2 */}
            {/* <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Descripción</label>
              <p className="text-gray-900 dark:text-dark-text">{entidad.descripcion || "-"}</p>
            </div> */}

          </div>
        </div>

        {/* [OPCIONAL] Segunda sección - descomentar y duplicar si se necesita */}
        {/* <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            ...campos...
          </div>
        </div> */}

      </div>
    </DetallesModal>
  );
};
