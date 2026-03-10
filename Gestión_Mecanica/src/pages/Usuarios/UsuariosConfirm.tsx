// =============================================================
// PLANTILLA: Confirmación de eliminación
// =============================================================
// PASOS PARA ADAPTAR:
//  1. Reemplazar "Entidad" / "entidad" por el nombre real
//  2. Cambiar el import de la API al que corresponda
//  3. Personalizar los textos del diálogo según la entidad
//  4. [OPCIONAL] Agregar parámetros extras si el DELETE necesita más datos
// =============================================================

import Swal from "sweetalert2";

// [TODO] Importar la función de eliminar correspondiente
// import { eliminarEntidad } from "../../api/entidadApi";

// [TODO] Renombrar la función: confirmarEliminarEntidad
export const confirmarEliminarEntidad = async (
  id: string,
  onSuccess: () => void,
  // [OPCIONAL] Parámetros extra si son necesarios:
  // nombre?: string,
) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.", // [TODO] Personalizar mensaje
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F39F23",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      // [TODO] Llamar a la función real de eliminación
      // await eliminarEntidad(id);

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El registro ha sido eliminado exitosamente.", // [TODO] Personalizar
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el registro. Inténtalo de nuevo.", // [TODO] Personalizar
        confirmButtonColor: "#F39F23",
      });
    }
  }
};
