import Swal from "sweetalert2";
import { eliminarItemInventario } from "../../api/inventarioApi";
import { showError } from "../../components/common/SweetAlert";

export const confirmarEliminarInventario = async (
  id: number,
  nombre: string,
  onSuccess: () => void,
) => {
  const result = await Swal.fire({
    title: "¿Eliminar repuesto?",
    text: `¿Está seguro que desea eliminar "${nombre}"? Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F39F23",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await eliminarItemInventario(String(id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: `El repuesto "${nombre}" fue eliminado exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (_) {
      showError(
        "Error",
        "No se pudo eliminar el repuesto. Inténtalo de nuevo.",
      );
    }
  }
};
