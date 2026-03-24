import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Edit,
  UserPlus,
  Info,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { showError } from "../../components/common/SweetAlert";
import { Usuario } from "../../types/usuario";
import { crearUsuario, actualizarUsuario } from "../../api/usuarioApi";

interface UsuariosFormProps {
  usuario?: Usuario | null;
  onClose: () => void;
  onSuccess: (nuevoUsuario?: Usuario) => void;
}

export const UsuariosForm = ({
  usuario,
  onClose,
  onSuccess,
}: UsuariosFormProps) => {
  const isEditing = !!usuario;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    rol: "",
    password: "",
    status: true,
  });

  useEffect(() => {
    if (isEditing && usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        username: usuario.username || "",
        rol: usuario.rol || "",
        password: "",
        status: usuario.status ?? true,
      });
    }
  }, [usuario, isEditing]);

  const set = (field: keyof typeof formData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        rol: formData.rol.trim(),
        status: formData.status,
        ...(isEditing ? {} : { password: formData.password }),
      };

      if (isEditing && usuario) {
        const actualizado = await actualizarUsuario(
          String(usuario.id),
          payload,
        );
        onSuccess(actualizado);
      } else {
        const nuevo = await crearUsuario(payload);
        onSuccess(nuevo);
      }
      onClose();
    } catch (error: any) {
      console.error("Error al guardar usuario:", error);
      const status = error?.response?.status;
      if (status === 409) {
        showError(
          "Username duplicado",
          "Ya existe un usuario registrado con ese Username.",
        );
      } else {
        showError(
          "Error",
          `No se pudo ${isEditing ? "actualizar" : "crear"} el usuario. Verifica los datos e intenta nuevamente.`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const estadoOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  const estadoRolOptions = [
    { value: "ADMIN", label: "Administrador" },
    { value: "USER", label: "Usuario" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                placeholder="Ej: Juan"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.apellido}
                onChange={(e) => set("apellido", e.target.value)}
                placeholder="Ej: Pérez García"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => set("username", e.target.value)}
                placeholder="Ej: juan.perez"
                required
                disabled={loading || isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Contraseña{" "}
                {isEditing ? (
                  "(dejar en blanco para no cambiar)"
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <Input
                type="text"
                value={formData.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={
                  isEditing ? "Nueva contraseña" : "Ingrese una contraseña"
                }
                required={!isEditing}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={estadoRolOptions}
                value={formData.rol}
                onChange={(val) => set("rol", val)}
                placeholder="Seleccione un rol"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={estadoOptions}
                value={String(formData.status)}
                onChange={(val) => set("status", val === "true")}
                placeholder="Seleccione un estado"
                disabled={loading}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex gap-3 p-6 border-t border-neutral-200 dark:text-white dark:border-neutral-700 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1 text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-colors"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          icon={
            isEditing ? (
              <Edit className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )
          }
          loading={loading}
          className="flex-1 bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          {isEditing ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
};
