import clienteApi from "../../api/clienteApi";
import Swal from "sweetalert2";

export const confirmarEliminarCliente = async (
  id: string,
  onSuccess: () => void
) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F39F23",
    cancelButtonColor: "#f4ac9c",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await clienteApi.eliminarCliente(id);
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El cliente ha sido eliminado exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess(); // Refrescar la lista de clientes
    } catch (error) {
      console.error("Error deleting cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el cliente. Inténtalo de nuevo.",
        confirmButtonColor: "#F39F23",
      });
    }
  }
};
