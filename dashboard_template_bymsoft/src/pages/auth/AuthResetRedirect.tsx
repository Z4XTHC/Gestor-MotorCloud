import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function base64UrlDecode(str: string) {
  // Replace URL-safe chars
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  // Pad with '='
  while (str.length % 4) str += "=";
  try {
    return atob(str);
  } catch (e) {
    return null;
  }
}

const AuthResetRedirect = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "No se encontró token en el enlace.",
      });
      navigate("/forgot-password");
      return;
    }

    const parts = token.split(".");
    if (parts.length < 2) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "Token corrupto.",
      });
      navigate("/forgot-password");
      return;
    }

    const payloadJson = base64UrlDecode(parts[1]);
    if (!payloadJson) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "No se pudo decodificar el token.",
      });
      navigate("/forgot-password");
      return;
    }

    let payload: any = null;
    try {
      payload = JSON.parse(payloadJson);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "Token inválido.",
      });
      navigate("/forgot-password");
      return;
    }

    const id = payload.id || payload.userId;
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "Token sin identificador.",
      });
      navigate("/forgot-password");
      return;
    }

    // Redirigir al flujo que espera /reset-password/:id
    navigate(`/reset-password/${id}`, { replace: true });
  }, [navigate, search]);

  return null;
};

export default AuthResetRedirect;
