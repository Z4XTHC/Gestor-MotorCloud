import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

const AccesoDenegado = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <ShieldAlert className="w-16 h-16 text-red-600 dark:text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Acceso Denegado
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          No tienes los permisos necesarios para acceder a esta página. Si crees
          que esto es un error, contacta con el administrador del sistema.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue bg-primary-dark hover:bg-primary hover:text-black text-white rounded-lg transition-colors duration-200 font-medium"
        >
          <Home className="w-5 h-5" />
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccesoDenegado;
