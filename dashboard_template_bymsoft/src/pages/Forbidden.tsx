import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";

export const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg dark:bg-dark-bg px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <ShieldAlert className="w-24 h-24 text-error" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Acceso Prohibido
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          No tienes los permisos necesarios para acceder a este recurso.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleGoBack} variant="secondary">
            Volver al inicio
          </Button>
          <Button onClick={handleLogout} variant="danger">
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};
