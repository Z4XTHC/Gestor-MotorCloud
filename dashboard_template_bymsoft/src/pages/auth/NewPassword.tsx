import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Lock, AlertTriangle } from "lucide-react";
import { Button } from "../../components/common/Button";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/api";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  password: string;
  confirmPassword: string;
}

export const NewPassword = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (!id) {
        Swal.fire({ icon: "error", title: "Error", text: "Enlace inválido." });
        return;
      }
      // Validación de confirmación
      if (data.password !== data.confirmPassword) {
        Swal.fire({
          icon: "info",
          title: "Validación",
          text: "Las contraseñas no coinciden.",
        });
        return;
      }
      const endpoint = (API_ENDPOINTS as any).AUTH?.RESET_PASSWORD
        ? (API_ENDPOINTS as any).AUTH.RESET_PASSWORD(id)
        : `/api/auth/reset-password/${id}`;
      await axiosInstance.post(endpoint, { password: data.password });
      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Su contraseña ha sido actualizada correctamente.",
      });
      navigate("/login");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Solicitud inválida",
          text: "El enlace de restablecimiento de contraseña no es válido. Por favor, solicite uno nuevo.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            err?.response?.data?.message ||
            "Error al restablecer la contraseña",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar que el token/id del enlace sea válido antes de mostrar el formulario
    const check = async () => {
      if (!id) {
        Swal.fire({
          icon: "error",
          title: "Enlace inválido",
          text: "Enlace de restablecimiento inválido.",
        });
        navigate("/forgot-password");
        return;
      }
      try {
        const endpoint = (API_ENDPOINTS as any).AUTH?.RESET_PASSWORD
          ? (API_ENDPOINTS as any).AUTH.RESET_PASSWORD(id)
          : `/api/auth/reset-password/${id}`;
        await axiosInstance.get(endpoint);
      } catch (err: any) {
        Swal.fire({
          icon: "info",
          title: "Enlace expirado o inválido",
          text: "El enlace de restablecimiento no es válido o ha expirado.",
        });
        navigate("/forgot-password");
      }
    };
    check();
  }, [id, navigate]);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-primary-lg p-8 border border-primary dark:border-dark-bg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-1">
          Nueva Contraseña
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingrese su nueva contraseña abajo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              {...register("password", {
                required: "Requerido",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-coral">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Requerido",
                validate: (v) =>
                  v === watch("password") || "Las contraseñas no coinciden",
              })}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-coral">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Actualizar Contraseña
        </Button>
      </form>
    </div>
  );
};
export default NewPassword;
