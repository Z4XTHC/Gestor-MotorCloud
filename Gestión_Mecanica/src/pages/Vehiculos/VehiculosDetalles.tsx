import {
  Car,
  Tag,
  Palette,
  Hash,
  Calendar,
  User,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Vehiculo } from "../../types/vehiculo";
import { Cliente } from "../../types/cliente";

interface VehiculosDetallesProps {
  vehiculo: Vehiculo | null;
  clientes?: Cliente[];
  onClose: () => void;
  onEdit?: (vehiculo: Vehiculo) => void;
}

export const VehiculosDetalles = ({
  vehiculo,
  clientes = [],
  onClose,
  onEdit,
}: VehiculosDetallesProps) => {
  if (!vehiculo) return null;

  const clienteId = vehiculo.cliente?.id ?? vehiculo.clienteId;
  const cliente = clientes.find((c) => c.id === clienteId);
  const nombreCliente = cliente
    ? `${cliente.nombre} ${cliente.apellido}`
    : vehiculo.cliente?.nombre
      ? `${vehiculo.cliente.nombre} ${vehiculo.cliente.apellido ?? ``}`
      : `ID: ${clienteId}`;

  return (
    <Modal
      isOpen={!!vehiculo}
      onClose={onClose}
      title={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`}
      icon={<Car className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {onEdit && (
            <Button
              icon={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(vehiculo)}
            >
              Editar
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* === Estado === */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Estado del vehículo
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              vehiculo.status
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {vehiculo.status ? (
              <ToggleRight className="w-3.5 h-3.5" />
            ) : (
              <ToggleLeft className="w-3.5 h-3.5" />
            )}
            {vehiculo.status ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* === Propietario === */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide flex items-center gap-2">
            <User className="w-4 h-4" /> Propietario
          </h3>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {nombreCliente}
              </p>
              {cliente && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  DNI: {cliente.dni}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* === Datos del Vehículo === */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide flex items-center gap-2">
            <Car className="w-4 h-4" /> Datos del Vehículo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Marca
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {vehiculo.marca || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Modelo
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {vehiculo.modelo || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Año
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {vehiculo.anio || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3" /> Color
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {vehiculo.color || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> Patente
              </p>
              <p className="text-sm font-mono font-bold text-neutral-900 dark:text-white tracking-widest">
                {vehiculo.patente || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                ID
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                #{vehiculo.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
