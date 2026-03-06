import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, User, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import Swal from "sweetalert2";

interface LoginFormData {
  username: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.username, data.password);
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message || "Error al iniciar sesión",
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-primary-lg p-8 border border-primary dark:border-dark-bg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-white dark:text-dark-bg" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de Usuario
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              {...register("username", {
                required: "El nombre de usuario es requerido",
              })}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition-colors min-h-[44px] dark:text-dark-text"
              placeholder="Nombre de usuario"
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-coral">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 4,
                  message: "Mínimo 4 caracteres",
                },
              })}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition-colors min-h-[44px] dark:text-dark-text"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-coral">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary border-neutral-light rounded focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Recordarme
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary dark:text-dark-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Iniciar Sesión
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-primary dark:text-dark-primary font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};
