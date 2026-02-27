import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { verifyUser, updatePassword } from "../../api/authApi";
import { Eye, EyeOff, Lock } from "lucide-react";

export const ActivateAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // tokenReceived reservado para futuras mejoras (mostrar estado de sesión temporal)
  // (desactivado para evitar warning por no uso)
  // const [tokenReceived, setTokenReceived] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID inválido");
      setLoading(false);
      return;
    }
    verifyUser(id)
      .then((data) => {
        if (data?.token) {
          const expires = new Date(Date.now() + 15 * 60 * 1000);
          localStorage.setItem("token", data.token);
          localStorage.setItem("token_exp", String(expires.getTime()));
        } else if (data?.message) {
          // Mostrar mensaje claro devuelto por el backend (ej. usuario ya activado)
          setError(String(data.message));
        }
      })
      .catch((err) => {
        const msg = (err as any)?.response?.data?.message;
        if (msg) setError(String(msg));
        else setError("No se pudo verificar el usuario");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const validatePassword = (pw: string) => {
    const rules = [/^(?=.{8,}).*$/, /.*[A-Z].*/, /.*[a-z].*/, /.*\d.*/];
    return rules.every((r) => r.test(pw));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!validatePassword(password)) {
      setError("La contraseña no cumple los requisitos");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await updatePassword(id, password);
      await Swal.fire({
        icon: "success",
        title: "Cuenta activada",
        text: "Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión.",
        confirmButtonText: "Ir a Iniciar sesión",
      });
      navigate("/login");
    } catch {
      setError("No se pudo actualizar la contraseña");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen w-screen bg-fixed bg-center bg-no-repeat bg-gradient-to-br from-primary via-primary-light to-accent dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg flex items-center justify-center p-4">
        <p className="text-white dark:text-dark-text">Cargando...</p>
      </div>
    );

  return (
    <div className="min-h-screen w-screen bg-fixed bg-center bg-no-repeat bg-gradient-to-br from-primary via-primary-light to-accent dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-warm-light dark:bg-dark-surface rounded-2xl shadow-primary-lg p-8 border border-neutral-light dark:border-dark-bg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white dark:text-dark-bg" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
              Activar Cuenta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Define tu contraseña para continuar
            </p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-coral text-center">{error}</p>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            aria-describedby="requirements"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition-colors min-h-[44px] dark:text-dark-text"
                  placeholder="••••••••"
                  required
                  aria-required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  aria-label="Mostrar/Ocultar contraseña"
                >
                  {show ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition-colors min-h-[44px] dark:text-dark-text"
                  placeholder="••••••••"
                  required
                  aria-required
                />
              </div>
            </div>

            <p
              id="requirements"
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              La contraseña debe contener al menos 8 caracteres, una mayúscula,
              una minúscula y un número.
            </p>

            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary text-white rounded-lg"
              >
                Activar cuenta
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary dark:text-dark-primary font-medium hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
