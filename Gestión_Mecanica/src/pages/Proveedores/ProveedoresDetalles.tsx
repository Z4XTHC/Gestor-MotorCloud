import { Building2, Edit, Mail, Phone, MapPin, Hash } from "lucide-react";
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import { Proveedor } from "../../types/proveedor";

interface ProveedoresDetallesProps {
  proveedor: Proveedor | null;
  onClose: () => void;
  onEdit?: (proveedor: Proveedor) => void;
}

export const ProveedoresDetalles = ({
  proveedor,
  onClose,
  onEdit,
}: ProveedoresDetallesProps) => {
  if (!proveedor) return null;

  return (
    <Modal
      isOpen={!!proveedor}
      onClose={onClose}
      title={proveedor.razonSocial}
      icon={
        <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      }
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {onEdit && (
            <Button
              icon={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(proveedor)}
              className="bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
            >
              Editar
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Información General */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide">
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                ID
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                #{proveedor.id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> CUIT
              </p>
              <p className="text-sm font-mono text-neutral-900 dark:text-white">
                {proveedor.cuit || "-"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Razón Social
              </p>
              <p className="text-sm text-neutral-900 dark:text-white font-medium">
                {proveedor.razonSocial}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Estado
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                  proveedor.status
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${proveedor.status ? "bg-green-500" : "bg-red-500"}`}
                />
                {proveedor.status ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {proveedor.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Teléfono
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {proveedor.telefono || "-"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Dirección
              </p>
              <p className="text-sm text-neutral-900 dark:text-white">
                {proveedor.direccion || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
