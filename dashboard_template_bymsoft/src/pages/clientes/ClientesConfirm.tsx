import { eliminarCliente } from "../../api/clienteApi";
import Swal from "sweetalert2";

export const confirmarEliminarClientes = async (id: string, onSuccess: () => void) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará al cliente de forma permanente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F39F23",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await eliminarCliente(id);
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El cliente ha sido eliminado exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el cliente. Inténtalo de nuevo.",
        confirmButtonColor: "#F39F23",
      });
    }
  }
};
