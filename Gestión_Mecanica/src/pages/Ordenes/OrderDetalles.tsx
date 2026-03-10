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
  Plus,
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
import { Modal } from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import { showError, showSuccess } from "../../components/common/SweetAlert";
import { Orden } from "../../types/orden";
import { actualizarOrden } from "../../api/ordenApi";

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

const INPUT =
  "w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none";

export function OrderDetalles({
  orden,
  onClose,
  onSuccess,
}: OrderDetallesProps) {
  const [localOrden, setLocalOrden] = useState<Orden | null>(orden);
  const [saving, setSaving] = useState(false);
  const [showAddLinea, setShowAddLinea] = useState(false);
  const [newLinea, setNewLinea] = useState({ descripcion: "", precio: "" });

  useEffect(() => {
    setLocalOrden(orden);
    setShowAddLinea(false);
    setNewLinea({ descripcion: "", precio: "" });
  }, [orden]);

  if (!localOrden) return null;

  const estadoConf =
    ESTADO_CONFIG[localOrden.estado] ?? ESTADO_CONFIG.PENDIENTE;
  const totalActual = (localOrden.lineasServicio ?? []).reduce(
    (s, l) => s + (l.precio ?? 0),
    0,
  );

  const buildPayload = (
    overrides: Partial<{ estado: string; lineasServicio: any[] }>,
  ) => ({
    ...localOrden,
    estado: overrides.estado ?? localOrden.estado,
    vehiculo: { id: localOrden.vehiculo.id },
    usuario: { id: localOrden.usuario.id },
    lineasServicio:
      overrides.lineasServicio ??
      (localOrden.lineasServicio ?? []).map((l) => ({
        descripcion: l.descripcion,
        precio: l.precio,
      })),
  });

  const handleCambiarEstado = async (nuevoEstado: string) => {
    setSaving(true);
    try {
      await actualizarOrden(
        String(localOrden.id),
        buildPayload({ estado: nuevoEstado }),
      );
      setLocalOrden(
        (prev) => prev && { ...prev, estado: nuevoEstado as Orden["estado"] },
      );
      showSuccess(
        "Estado actualizado",
        `La orden pasó a: ${ESTADO_CONFIG[nuevoEstado]?.label ?? nuevoEstado}`,
      );
      onSuccess();
    } catch {
      showError("Error", "No se pudo actualizar el estado");
    } finally {
      setSaving(false);
    }
  };

  const handleAgregarLinea = async () => {
    if (
      !newLinea.descripcion.trim() ||
      !newLinea.precio ||
      parseFloat(newLinea.precio) < 0
    ) {
      showError(
        "Datos inválidos",
        "Por favor completa descripción y precio correctamente.",
      );
      return;
    }

    const nuevasLineas = [
      ...(localOrden.lineasServicio ?? []).map((l) => ({
        descripcion: l.descripcion,
        precio: l.precio,
      })),
      {
        descripcion: newLinea.descripcion.trim(),
        precio: parseFloat(newLinea.precio),
      },
    ];

    setSaving(true);
    try {
      await actualizarOrden(
        String(localOrden.id),
        buildPayload({ lineasServicio: nuevasLineas }),
      );
      setLocalOrden((prev) =>
        prev ? { ...prev, lineasServicio: nuevasLineas } : prev,
      );
      setNewLinea({ descripcion: "", precio: "" });
      setShowAddLinea(false);
      showSuccess("Línea agregada", "Servicio registrado correctamente");
      onSuccess();
    } catch {
      showError("Error", "No se pudo agregar el servicio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={!!localOrden}
      onClose={onClose}
      title={`Orden ${localOrden.numeroOrden}`}
      icon={
        <ClipboardList className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      }
      maxWidth="5xl"
      footer={
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      {/* Cabecera: Estado y Fecha */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${estadoConf.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${estadoConf.dot}`} />
          {estadoConf.label}
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Ingresó el{" "}
          {new Date(localOrden.fechaCreacion).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
        {localOrden.descripcion && (
          <p className="w-full text-sm text-neutral-600 dark:text-neutral-400 italic">
            "{localOrden.descripcion}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: Progreso y Servicios */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <Clock className="w-3.5 h-3.5" /> Progreso del trabajo
            </h3>
            <div className="space-y-1">
              {WORKFLOW_STEPS.map((step, i) => {
                const done =
                  localOrden.estado !== "CANCELADA" &&
                  step.completedIn.includes(localOrden.estado);
                const isCancelled = localOrden.estado === "CANCELADA";
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center pt-0.5">
                      {isCancelled ? (
                        <XCircle className="w-5 h-5 text-red-300" />
                      ) : done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300" />
                      )}
                      {i < WORKFLOW_STEPS.length - 1 && (
                        <div
                          className={`w-px flex-1 min-h-[20px] mt-1 ${done ? "bg-green-300" : "bg-neutral-200"}`}
                        />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p
                        className={`text-sm font-medium ${done ? "text-neutral-900 dark:text-white" : "text-neutral-400"}`}
                      >
                        {step.key}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                <Wrench className="w-3.5 h-3.5" /> Servicios y Repuestos
              </h3>
              {localOrden.estado !== "CANCELADA" && (
                <button
                  onClick={() => setShowAddLinea(!showAddLinea)}
                  className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Agregar línea
                </button>
              )}
            </div>

            {!localOrden.lineasServicio ||
            localOrden.lineasServicio.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-dashed border-neutral-300">
                <Package className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                <p className="text-sm text-neutral-500">
                  Sin servicios registrados aún
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                {localOrden.lineasServicio.map((ls, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-800 border-b last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm dark:text-white">
                        {ls.descripcion}
                      </span>
                    </div>
                    <span className="text-sm font-semibold dark:text-white">
                      ${ls.precio.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 font-bold">
                  <span className="text-sm text-neutral-600">Total</span>
                  <span className="text-base text-primary-600">
                    ${totalActual.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            )}

            {showAddLinea && (
              <div className="mt-3 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-200 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={newLinea.descripcion}
                    onChange={(e) =>
                      setNewLinea({ ...newLinea, descripcion: e.target.value })
                    }
                    placeholder="Descripción del servicio..."
                    className={INPUT}
                  />
                  <input
                    type="number"
                    value={newLinea.precio}
                    onChange={(e) =>
                      setNewLinea({ ...newLinea, precio: e.target.value })
                    }
                    placeholder="Precio"
                    className={`${INPUT} sm:w-32`}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAgregarLinea}
                    loading={saving}
                  >
                    Confirmar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddLinea(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* COLUMNA DERECHA: Información y Acciones */}
        <div className="space-y-4">
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-b font-semibold text-xs uppercase text-neutral-500">
              Información
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-neutral-500 flex items-center gap-2">
                  <Car size={14} /> Vehículo
                </p>
                <p className="text-sm font-bold dark:text-white">
                  {localOrden.vehiculo?.patente} - {localOrden.vehiculo?.marca}{" "}
                  {localOrden.vehiculo?.modelo}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 flex items-center gap-2">
                  <User size={14} /> Cliente
                </p>
                <p className="text-sm font-bold dark:text-white">
                  {localOrden.vehiculo?.cliente?.nombre}{" "}
                  {localOrden.vehiculo?.cliente?.apellido}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 flex items-center gap-2">
                  <Wrench size={14} /> Técnico
                </p>
                <p className="text-sm font-bold dark:text-white">
                  {localOrden.usuario?.nombre}{" "}
                  {localOrden.usuario?.apellido || "No asignado"}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Acciones
            </h3>
            {localOrden.estado === "PENDIENTE" && (
              <button
                onClick={() => handleCambiarEstado("EN_PROGRESO")}
                disabled={saving}
                className="w-full flex items-center justify-between px-4 py-3 bg-primary-500 text-white rounded-xl font-medium"
              >
                Iniciar Trabajo <ChevronRight size={18} />
              </button>
            )}
            {localOrden.estado === "EN_PROGRESO" && (
              <button
                onClick={() => handleCambiarEstado("COMPLETADA")}
                disabled={saving}
                className="w-full flex items-center justify-between px-4 py-3 bg-green-600 text-white rounded-xl font-medium"
              >
                Marcar Completada <CheckCheck size={18} />
              </button>
            )}
            {(localOrden.estado === "PENDIENTE" ||
              localOrden.estado === "EN_PROGRESO") && (
              <button
                onClick={() => handleCambiarEstado("CANCELADA")}
                disabled={saving}
                className="w-full flex items-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-xl text-sm font-medium"
              >
                <Ban size={16} /> Cancelar Orden
              </button>
            )}
          </section>
        </div>
      </div>
    </Modal>
  );
}
