import { eliminarUsuario } from "../../api/userApi";
import Swal from "sweetalert2";

export const confirmarEliminarUsuario = async (id: string, onSuccess: () => void) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F39F23",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await eliminarUsuario(id);
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El usuario ha sido eliminado exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el usuario. Inténtalo de nuevo.",
        confirmButtonColor: "#F39F23",
      });
    }
  }
};
