import { useState, useEffect } from "react";
import { Edit, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Usuario } from "../../types/usuario";
import { crearUsuario, actualizarUsuario } from "../../api/userApi";
import { Input } from "../../components/common/Input";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { showSuccess, showError } from "../../components/common/SweetAlert";

interface UsuariosFormProps {
  usuario?: Usuario | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const UsuariosForm = ({
  usuario,
  onClose,
  onSuccess,
}: UsuariosFormProps) => {
  const isEditing = !!usuario;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    password: "",
    rol: "USER",
    status: true,
  });

  useEffect(() => {
    if (isEditing && usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        username: usuario.username || "",
        password: "",
        rol: usuario.rol || "USER",
        status: usuario.status ?? true,
      });
    }
  }, [usuario, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        username: formData.username,
        rol: formData.rol,
        status: formData.status,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      if (isEditing && usuario) {
        await actualizarUsuario(String(usuario.id), payload);
        showSuccess("Actualizado", "Usuario actualizado exitosamente");
      } else {
        await crearUsuario(payload);
        showSuccess("Creado", "Usuario creado exitosamente");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      showError("Error", `No se pudo ${isEditing ? "actualizar" : "crear"} el usuario`);
    } finally {
      setLoading(false);
    }
  };

  const rolOptions = [
    { value: "USER", label: "Usuario" },
    { value: "ADMIN", label: "Administrador" },
  ];

  const estadoOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-neutral-light dark:border-dark-bg p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <Input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Apellido
              </label>
              <Input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nombre de usuario *
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {isEditing ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña *"}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditing}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Rol *
              </label>
              <SearchableSelect
                options={rolOptions}
                value={formData.rol}
                onChange={(val) => setFormData({ ...formData, rol: val })}
                placeholder="Seleccione un rol"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Estado *
              </label>
              <SearchableSelect
                options={estadoOptions}
                value={String(formData.status)}
                onChange={(val) => setFormData({ ...formData, status: val === "true" })}
                placeholder="Seleccione un estado"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-light dark:border-dark-bg">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              icon={isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              disabled={loading}
            >
              {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
