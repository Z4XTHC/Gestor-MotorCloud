import Swal from "sweetalert2";
import { eliminarTecnico } from "../../api/tecnicosApi";

export const confirmarEliminarTecnico = async (
  id: string,
  onSuccess: () => void
) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F39F23",
    cancelButtonColor: "#f4ac9c",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await eliminarTecnico(id);
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Técnico eliminado exitosamente",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (error) {
      console.error("Error deleting tecnico:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el técnico",
        confirmButtonColor: "#F39F23",
      });
    }
  }
};
