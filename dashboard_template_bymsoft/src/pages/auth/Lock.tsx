import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AlertTriangle, Lock } from "lucide-react";
import { Button } from "../../components/common/Button";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

interface FormData {
  password: string;
}

export const UnlockSession = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const { user, login, logout, unlockSession } = useAuth();
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // focus en el input de contraseña para accesibilidad
    if (passwordRef.current) passwordRef.current.focus();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!user?.username) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario no encontrado. Por favor, inicie sesión nuevamente.",
      });
      return;
    }

    setLoading(true);
    try {
      await login(user.username, data.password);
      // marcar como desbloqueado y reiniciar timer
      try {
        unlockSession();
      } catch (e) {}
      Swal.fire({
        icon: "success",
        title: "Sesión desbloqueada",
        timer: 1200,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Contraseña incorrecta",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-primary-lg p-8 border border-primary dark:border-dark-bg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-1">
          Sesión bloqueada
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Por razones de seguridad, se bloqueó la sesión. Coloque su contraseña
          para continuar con la sesión.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo
          </label>
          <div className="relative">
            <input
              type="text"
              value={user?.username || ""}
              readOnly
              className="w-full pl-4 pr-4 py-2 bg-gray-100 dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              ref={passwordRef}
              type="password"
              {...register("password", { required: "Requerido" })}
              className="w-full pl-4 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Contraseña para desbloquear sesión"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-coral">{errors.password.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={loading} className="flex-1">
            Ingresar
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </form>
      {/* Region para lectores de pantalla que anuncia el estado de la sesión */}
      <div aria-live="polite" className="sr-only">
        Sesión bloqueada. Coloque su contraseña para continuar.
      </div>
    </div>
  );
};

export default UnlockSession;
