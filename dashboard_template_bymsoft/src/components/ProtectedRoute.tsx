import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  inConstruction?: boolean;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  inConstruction,
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { locked } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg dark:bg-dark-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la sesión está bloqueada, redirigir a la pantalla de desbloqueo
  if (locked) {
    return <Navigate to="/lock" replace />;
  }

  // Redirigir si la página está en construcción
  if (inConstruction) {
    return <Navigate to="/en-construccion" replace />;
  }

  // Validar roles si se especificaron
  if (allowedRoles && allowedRoles.length > 0) {
    const getUserRole = (): string => {
      if (user?.admin === true) return "admin";
      if (user?.role === "admin") return "admin";
      if (
        Array.isArray((user as any)?.roles) &&
        (user as any).roles.includes("admin")
      )
        return "admin";
      if (user?.tecnico_id) return "tecnico";
      if (user?.role === "tecnico") return "tecnico";
      if (
        Array.isArray((user as any)?.roles) &&
        (user as any).roles.includes("tecnico")
      )
        return "tecnico";
      if (user?.cliente_id) return "cliente";
      if (user?.role === "cliente") return "cliente";
      return "guest";
    };

    const userRole = getUserRole();

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  return <>{children}</>;
};
