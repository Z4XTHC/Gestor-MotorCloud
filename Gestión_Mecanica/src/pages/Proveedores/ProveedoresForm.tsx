import { useState, useEffect } from "react";
import { Building2, Hash, Phone, Mail, MapPin, Edit, Plus } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { showError } from "../../components/common/SweetAlert";
import { Proveedor } from "../../types/proveedor";
import { crearProveedor, actualizarProveedor } from "../../api/proveedorApi";

interface ProveedoresFormProps {
  proveedor?: Proveedor | null;
  onClose: () => void;
  onSuccess: (proveedor?: Proveedor) => void;
}

export const ProveedoresForm = ({
  proveedor,
  onClose,
  onSuccess,
}: ProveedoresFormProps) => {
  const isEditing = !!proveedor;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    razonSocial: "",
    cuit: "",
    telefono: "",
    email: "",
    direccion: "",
    status: true,
  });

  useEffect(() => {
    if (isEditing && proveedor) {
      setFormData({
        razonSocial: proveedor.razonSocial || "",
        cuit: proveedor.cuit || "",
        telefono: proveedor.telefono || "",
        email: proveedor.email || "",
        direccion: proveedor.direccion || "",
        status: proveedor.status ?? true,
      });
    }
  }, [proveedor, isEditing]);

  const set = (field: keyof typeof formData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        razonSocial: formData.razonSocial.trim(),
        cuit: formData.cuit.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        direccion: formData.direccion.trim(),
        status: formData.status,
      };

      if (isEditing && proveedor) {
        const actualizado = await actualizarProveedor(
          String(proveedor.id),
          payload,
        );
        onSuccess(actualizado);
      } else {
        const nuevo = await crearProveedor(payload);
        onSuccess(nuevo);
      }
      onClose();
    } catch (error: unknown) {
      console.error("Error al guardar proveedor:", error);
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 409) {
        showError("CUIT duplicado", "Ya existe un proveedor con ese CUIT.");
      } else {
        showError(
          "Error",
          `No se pudo ${isEditing ? "actualizar" : "crear"} el proveedor.`,
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
        {/* Información principal */}
        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Información del Proveedor
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.razonSocial}
                onChange={(e) => set("razonSocial", e.target.value)}
                placeholder="Ej: AutoParts S.A."
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  CUIT <span className="text-red-500">*</span>
                </span>
              </label>
              <Input
                type="text"
                value={formData.cuit}
                onChange={(e) => set("cuit", e.target.value)}
                placeholder="Ej: 30-12345678-9"
                required
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

        {/* Contacto */}
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
                placeholder="proveedor@empresa.com"
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
                placeholder="Ej: +54 11 1234 5678"
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
                placeholder="Ej: Av. Industrial 456, Buenos Aires"
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
              <Plus className="w-4 h-4" />
            )
          }
          loading={loading}
          className="flex-1 bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          {isEditing ? "Guardar Cambios" : "Crear Proveedor"}
        </Button>
      </div>
    </form>
  );
};
