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
import { Cliente } from "../../types/cliente";
import { crearCliente, actualizarCliente } from "../../api/clienteApi";

interface ClientesFormProps {
  cliente?: Cliente | null;
  onClose: () => void;
  onSuccess: (nuevoCliente?: Cliente) => void;
}

export const UsuariosForm = ({
  cliente,
  onClose,
  onSuccess,
}: ClientesFormProps) => {
  const isEditing = !!cliente;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    dni: "",
    status: true,
  });

  useEffect(() => {
    if (isEditing && cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        dni: cliente.dni || "",
        status: cliente.status ?? true,
      });
    }
  }, [cliente, isEditing]);

  const set = (field: keyof typeof formData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        dni: formData.dni.trim(),
        status: formData.status,
      };

      if (isEditing && cliente) {
        const actualizado = await actualizarCliente(
          String(cliente.id),
          payload,
        );
        onSuccess(actualizado);
      } else {
        const nuevo = await crearCliente(payload);
        onSuccess(nuevo);
      }
      onClose();
    } catch (error: any) {
      console.error("Error al guardar cliente:", error);
      const status = error?.response?.status;
      if (status === 409) {
        showError(
          "DNI duplicado",
          "Ya existe un cliente registrado con ese DNI.",
        );
      } else {
        showError(
          "Error",
          `No se pudo ${isEditing ? "actualizar" : "crear"} el cliente. Verifica los datos e intenta nuevamente.`,
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
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  DNI / RUT <span className="text-red-500">*</span>
                </span>
              </label>
              <Input
                type="text"
                value={formData.dni}
                onChange={(e) => set("dni", e.target.value)}
                placeholder="Ej: 12.345.678-9"
                required
                disabled={loading || isEditing}
              />
              {isEditing && (
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                  <Info className="w-3 h-3 inline" /> El DNI no puede
                  modificarse
                </p>
              )}
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

        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Información de Contacto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  Correo Electrónico <span className="text-red-500">*</span>
                </span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  Teléfono <span className="text-red-500">*</span>
                </span>
              </label>
              <Input
                type="tel"
                value={formData.telefono}
                onChange={(e) => set("telefono", e.target.value)}
                placeholder="Ej: +56 9 1234 5678"
                required
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Dirección
                </span>
              </label>
              <Input
                type="text"
                value={formData.direccion}
                onChange={(e) => set("direccion", e.target.value)}
                placeholder="Ej: Av. Principal 123, Ciudad"
                disabled={loading}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
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
          {isEditing ? "Guardar Cambios" : "Crear Cliente"}
        </Button>
      </div>
    </form>
  );
};
