import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, AlertTriangle } from "lucide-react";
import { Button } from "../../components/common/Button";
import { solicitarReseteoPassword } from "../../api/authApi";
import Swal from "sweetalert2";

interface FormData {
  email: string;
}

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await solicitarReseteoPassword(data.email);
      Swal.fire({
        icon: "success",
        title: "Enviado",
        text: "Si la dirección existe, recibirá un correo con instrucciones.",
      });
      // Redirigir al login
      navigate("/login");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Solicitud recibida",
          text: "Si la dirección existe, recibirá un correo. Si no, contacte al administrador.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            err?.response?.data?.message || "Error al solicitar recuperación",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-primary-lg p-8 border border-primary dark:border-dark-bg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-1">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ingrese su correo registrado para recibir instrucciones.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              {...register("email", { required: "Requerido" })}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-coral">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Enviar
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
