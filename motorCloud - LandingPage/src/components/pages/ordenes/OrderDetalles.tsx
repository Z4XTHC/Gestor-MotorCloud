import { useState, useEffect } from "react";
import {
  ClipboardList,
  Car,
  User,
  Calendar,
  Clock,
  Wrench,
  CheckCircle2,
  Circle,
  XCircle,
  Package,
  Loader2,
  PlayCircle,
  CheckCheck,
  Ban,
  Phone,
  Mail,
  ChevronRight,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Modal } from "../../../components/common/Modal.tsx";
import { Button } from "../../../components/common/Button.tsx";
import { Orden } from "../../../types/orden.ts";
import Swal from "sweetalert2";

interface OrderDetallesProps {
  orden: Orden | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ESTADO_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  PENDIENTE: {
    label: "Pendiente",
    badge:
      "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300",
    dot: "bg-neutral-400",
  },
  EN_PROGRESO: {
    label: "En Progreso",
    badge:
      "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300",
    dot: "bg-primary-500",
  },
  COMPLETADA: {
    label: "Completada",
    badge:
      "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
  CANCELADA: {
    label: "Cancelada",
    badge: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
};

const WORKFLOW_STEPS = [
  { key: "Ingreso", completedIn: ["PENDIENTE", "EN_PROGRESO", "COMPLETADA"] },
  { key: "Diagnóstico", completedIn: ["EN_PROGRESO", "COMPLETADA"] },
  { key: "Reparación", completedIn: ["EN_PROGRESO", "COMPLETADA"] },
  { key: "Control de Calidad", completedIn: ["COMPLETADA"] },
  { key: "Listo para entrega", completedIn: ["COMPLETADA"] },
];

// Eliminado INPUT no usado

export function OrderDetalles({
  orden,
  onClose,
  onSuccess,
}: OrderDetallesProps) {
  const [localOrden, setLocalOrden] = useState<Orden | null>(orden);
  useEffect(() => {
    setLocalOrden(orden);
  }, [orden]);

  if (!localOrden) return null;

  const estadoConf =
    ESTADO_CONFIG[localOrden.estado] ?? ESTADO_CONFIG.PENDIENTE;
  const totalActual = (localOrden.lineasServicio ?? []).reduce(
    (s, l) => s + (l.precio ?? 0),
    0,
  );

  // Limpiados íconos no usados
  return (
    <Modal
      isOpen={!!localOrden}
      onClose={onClose}
      title={`Seguimiento de Orden #${localOrden.numeroOrden}`}
      icon={<ClipboardList className="w-5 h-5 text-primary-500" />} // Color corporativo
      maxWidth="5xl"
      footer={
        <>
          <Button
            variant="outline"
            className="bg-blue-600 border-blue-600 hover:bg-blue-500 hover:border-blue-500 text-white transition-colors"
            onClick={() => {
              // Lógica de pago aquí para mercado pago, por ahora saltara un sweet alert 2 del pago con exito.\
              Swal.fire({
                icon: "info",
                title: "Redirigiendo",
                text: "Seras redirigido a WhatsApp para contactarse con Soporte.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3b82f6",
              }).then(() => {
                onSuccess();
                onClose();
              });
            }}
          >
            Contactar Soporte
          </Button>
          <Button
            variant="outline"
            className="bg-green-600 border-green-600 hover:bg-green-500 hover:border-green-500 text-white transition-colors"
            onClick={() => {
              // Lógica de pago aquí para mercado pago, por ahora saltara un sweet alert 2 del pago con exito.\
              Swal.fire({
                icon: "success",
                title: "Pago Realizado",
                text: "Tu pago ha sido procesado exitosamente.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#22c55e",
              }).then(() => {
                onSuccess();
                onClose();
              });
            }}
          >
            Realizar Pago
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-orange-500 bg-orange-600 border-orange-600 hover:border-orange-500 text-white transition-colors"
          >
            Cerrar Seguimiento
          </Button>
        </>
      }
    >
      {/* Cabecera Principal - Estilo Banner */}
      <div className="mb-8 p-6 rounded-2xl border border-neutral-200 bg-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="inline-flex p-4 bg-primary-50 rounded-xl">
            <Clock className="h-8 w-8 text-orange-500" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${estadoConf.badge.replace(/dark:[^ ]+/g, "")}`}
              >
                {estadoConf.label}
              </span>
            </div>
            <p className="text-sm text-neutral-500 flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4" />
              Ingresó el{" "}
              {new Date(localOrden.fechaCreacion).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {localOrden.descripcion && (
          <div className="md:max-w-xs border-l-2 border-primary-500 pl-4 py-1">
            <p className="text-sm font-bold text-neutral-900">
              Descripción del Trabajo
            </p>
            <p className="text-sm text-neutral-600 italic leading-relaxed">
              "{localOrden.descripcion}"
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: Progreso Visual (Corregido) */}
        <div className="lg:col-span-1 space-y-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.15em] mb-6">
            Estado del Trabajo
          </h3>
          <div className="relative">
            {WORKFLOW_STEPS.map((step, i) => {
              // Lógica corregida: solo usar estados válidos
              const isDone =
                localOrden.estado !== "CANCELADA" &&
                step.completedIn.includes(localOrden.estado);
              const isCurrent = localOrden.estado === step.key;

              return (
                <div
                  key={step.key}
                  className="relative flex gap-4 pb-10 last:pb-0"
                >
                  {/* Línea conectora dinámica */}
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div
                      className={`absolute left-[11px] top-8 w-[2px] h-full transition-colors duration-500 ${isDone ? "bg-green-500" : "bg-neutral-200"}`}
                    />
                  )}

                  <div className="relative z-10 mt-1">
                    {isDone ? (
                      <div className="bg-green-500 rounded-full p-1.5 shadow-sm ring-4 ring-green-50 transition-all">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="rounded-full w-6 h-6 border-2 border-green-500 flex items-center justify-center bg-white ring-4 ring-green-50">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                    ) : (
                      <div className="rounded-full w-6 h-6 border-2 border-neutral-300 bg-white flex items-center justify-center group-hover:border-neutral-400 transition-colors">
                        <Circle className="w-2 h-2 text-neutral-100" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold transition-colors ${isDone || isCurrent ? "text-neutral-900" : "text-neutral-400"}`}
                    >
                      {step.key}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-black text-primary-600 uppercase tracking-tighter mt-0.5">
                        Paso Actual
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: Datos y Presupuesto */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Vehículo */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-soft transition-all hover:border-primary-200">
              <div className="flex items-center gap-2 text-primary-500 mb-3 font-bold text-[10px] uppercase tracking-widest">
                <Car size={16} className="text-orange-600" /> Vehículo
              </div>
              <p className="text-lg font-bold text-neutral-900 leading-tight">
                {localOrden.vehiculo?.marca} {localOrden.vehiculo?.modelo}
              </p>
              <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded bg-orange-600 text-white text-[11px] font-mono font-bold tracking-wider">
                {localOrden.vehiculo?.patente}
              </div>
            </div>

            {/* Card Técnico */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-soft transition-all hover:border-primary-200">
              <div className="flex items-center gap-2 text-primary-500 mb-3 font-bold text-[10px] uppercase tracking-widest">
                <Wrench size={16} className="text-orange-600" /> Mecanico
                Asignado
              </div>
              <p className="text-lg font-bold text-orange-600">
                {localOrden.usuario
                  ? `${localOrden.usuario.nombre} ${localOrden.usuario.apellido}`
                  : "Especialista Asignado"}
              </p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">
                Certificado por Motor Cloud
              </p>
            </div>
          </div>

          {/* Detalle de Presupuesto Estilo Recibo */}
          <div className="rounded-2xl border border-neutral-200 overflow-hidden shadow-medium bg-white">
            <div className="px-6 py-4 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-bold text-sm text-neutral-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-600" /> Detalle de
                Presupuesto
              </h3>
            </div>

            <div className="divide-y divide-neutral-100">
              {localOrden.lineasServicio?.map((ls, i) => (
                <div
                  key={i}
                  className="px-6 py-5 flex justify-between items-center transition-colors hover:bg-neutral-50/50"
                >
                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      {ls.descripcion}
                    </p>
                  </div>
                  <span className="font-bold text-green-600 text-md">
                    ${ls.precio.toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            {/* Banner de Total - Refleja la jerarquía de inversión */}
            <div className="px-8 py-8 bg-orange-600 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-white text-[12px] uppercase font-black tracking-[0.3em] mb-1">
                  Inversión Final
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-white text-sm font-bold">$</span>
                <span className="text-4xl font-black text-white tracking-tighter">
                  {totalActual.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
