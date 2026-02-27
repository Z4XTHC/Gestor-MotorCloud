{
  /* pagina error 404 */
}

import { useNavigate } from "react-router-dom";
import { Home, SearchSlash } from "lucide-react";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <SearchSlash className="w-16 h-16 text-red-600 dark:text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Error 404 - Página no encontrada
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Lo sentimos, la página que estás buscando no existe. Puede que haya
          sido movida o eliminada. Revisa la URL o vuelve al dashboard.
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

export default Error404;
