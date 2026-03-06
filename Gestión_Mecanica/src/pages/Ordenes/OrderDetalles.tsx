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
      "bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-300",
    dot: "bg-success-500",
  },
  CANCELADA: {
    label: "Cancelada",
    badge:
      "bg-error-100 dark:bg-error-900/20 text-error-700 dark:text-error-300",
    dot: "bg-error-500",
  },
};

/**
 * Cada paso del workflow y en qué estados se considera "completado".
 * El estado del pipeline visual se deriva del `estado` de la Orden.
 */
const WORKFLOW_STEPS = [
  {
    key: "Ingreso",
    completedIn: ["PENDIENTE", "EN_PROGRESO", "COMPLETADA"],
  },
  { key: "Diagnóstico", completedIn: ["EN_PROGRESO", "COMPLETADA"] },
  { key: "Reparación", completedIn: ["EN_PROGRESO", "COMPLETADA"] },
  { key: "Control de Calidad", completedIn: ["COMPLETADA"] },
  { key: "Listo para entrega", completedIn: ["COMPLETADA"] },
];

const INPUT =
  "w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none";

// Componente
export function OrderDetalles({
  orden,
  onClose,
  onSuccess,
}: OrderDetallesProps) {
  // Estado local para reflejar cambios sin cerrar el modal
  const [localOrden, setLocalOrden] = useState<Orden | null>(orden);
  const [saving, setSaving] = useState(false);
  const [showAddLinea, setShowAddLinea] = useState(false);
  const [newLinea, setNewLinea] = useState({ descripcion: "", precio: "" });

  // Sincronizar con el prop cuando cambia (el componente permanece montado)
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

  /** Construye el payload completo para actualizarOrden */
  const buildPayload = (
    overrides: Partial<{
      estado: string;
      lineasServicio: { descripcion: string; precio: number }[];
    }>,
  ) => ({
    numeroOrden: localOrden.numeroOrden,
    fechaCreacion: localOrden.fechaCreacion,
    fechaEntrega: localOrden.fechaEntrega,
    descripcion: localOrden.descripcion,
    estado: overrides.estado ?? localOrden.estado,
    vehiculo: { id: localOrden.vehiculo.id },
    usuario: { id: localOrden.usuario.id },
    status: localOrden.status,
    lineasServicio:
      overrides.lineasServicio ??
      (localOrden.lineasServicio ?? []).map((l) => ({
        descripcion: l.descripcion,
        precio: l.precio,
      })),
  });

  // ── Cambiar estado del workflow ────────────────────────────────────────────────────────────────
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
      showError("Error", "No se pudo actualizar el estado de la orden");
    } finally {
      setSaving(false);
    }
  };

  // ── Agregar línea de servicio ────────────────────────────────────────────────────────────────
  const handleAgregarLinea = async () => {
    if (!newLinea.descripcion.trim()) {
      showError("Campo requerido", "Ingresa una descripción para el servicio");
      return;
    }
    if (!newLinea.precio || parseFloat(newLinea.precio) < 0) {
      showError("Precio inválido", "Ingresa un precio válido");
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
      // Actualizar estado local sin cerrar el modal
      setLocalOrden((prev) =>
        prev
          ? {
              ...prev,
              lineasServicio: [
                ...(prev.lineasServicio ?? []),
                {
                  descripcion: newLinea.descripcion.trim(),
                  precio: parseFloat(newLinea.precio),
                },
              ],
            }
          : prev,
      );
      setNewLinea({ descripcion: "", precio: "" });
      setShowAddLinea(false);
      showSuccess("Línea agregada", "El servicio fue registrado correctamente");
      onSuccess();
    } catch {
      showError("Error", "No se pudo agregar la línea de servicio");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────────────────
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
      {/* Estado + fecha */}
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
        {/* --- COLUMNA IZQUIERDA (2/3): Timeline + Servicios --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <Clock className="w-3.5 h-3.5" />
              Progreso del trabajo
            </h3>
            <div className="space-y-1">
              {WORKFLOW_STEPS.map((step, i) => {
                const done =
                  localOrden.estado !== "CANCELADA" &&
                  step.completedIn.includes(localOrden.estado);
                const isCancelled = localOrden.estado === "CANCELADA";

                return (
                  <div key={step.key} className="flex gap-3">
                    {/* Indicador + conector */}
                    <div className="flex flex-col items-center pt-0.5">
                      {isCancelled ? (
                        <XCircle className="w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0" />
                      ) : done ? (
                        <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0" />
                      )}
                      {i < WORKFLOW_STEPS.length - 1 && (
                        <div
                          className={`w-px flex-1 min-h-[20px] mt-1 ${
                            done
                              ? "bg-success-300 dark:bg-success-800"
                              : "bg-neutral-200 dark:bg-neutral-700"
                          }`}
                        />
                      )}
                    </div>
                    {/* Texto */}
                    <div className="pb-4 flex-1">
                      <p
                        className={`text-sm font-medium leading-tight ${
                          done
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        {step.key}
                        {done && step.key === "Ingreso" && (
                          <span className="ml-2 text-xs font-normal text-neutral-400 dark:text-neutral-500">
                            (
                            {new Date(
                              localOrden.fechaCreacion,
                            ).toLocaleDateString("es-AR")}
                            )
                          </span>
                        )}
                        {done && step.key === "Listo para entrega" && (
                          <span className="ml-2 text-xs font-normal text-neutral-400 dark:text-neutral-500">
                            (
                            {new Date(
                              localOrden.fechaEntrega,
                            ).toLocaleDateString("es-AR")}
                            )
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tooltip informativo sobre el pipeline */}
            <div className="flex items-start gap-2 p-3 mt-2 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
              <Info className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                El progreso se actualiza automáticamente al avanzar el estado
                de la orden desde el panel{" "}
                <span className="font-semibold">Acciones</span>.
              </p>
            </div>
          </section>

          {/* Líneas de servicio */}
          <section>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                <Wrench className="w-3.5 h-3.5" />
                Servicios y Repuestos
              </h3>
              {localOrden.estado !== "CANCELADA" && (
                <button
                  onClick={() => setShowAddLinea((v) => !v)}
                  className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  <Plus className="w-3 h-3" />
                  Agregar línea
                </button>
              )}
            </div>

            {/* Lista de lÃ­neas */}
            {(localOrden.lineasServicio ?? []).length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600">
                <Package className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Sin servicios registrados aÃºn
                </p>
                {localOrden.estado !== "CANCELADA" && (
                  <button
                    onClick={() => setShowAddLinea(true)}
                    className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    + Agregar primer servicio
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                {(localOrden.lineasServicio ?? []).map((ls, i) => (
                  <div
                    key={ls.id ?? i}
                    className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 last:border-none hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {ls.descripcion}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                      ${(ls.precio ?? 0).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
                {/* Fila total */}
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-700/50">
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    Total
                  </span>
                  <span className="text-base font-bold text-neutral-900 dark:text-white tabular-nums">
                    ${totalActual.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            )}

            {/* Formulario agregar línea */}
            {showAddLinea && (
              <div className="mt-3 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-200 dark:border-primary-800 space-y-3">
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Nueva línea de servicio o repuesto
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={newLinea.descripcion}
                    onChange={(e) =>
                      setNewLinea((p) => ({
                        ...p,
                        descripcion: e.target.value,
                      }))
                    }
                    placeholder="Ej: Cambio de aceite, Pastillas de freno..."
                    className={`${INPUT} flex-1`}
                    autoFocus
                  />
                  <div className="relative w-36">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newLinea.precio}
                      onChange={(e) =>
                        setNewLinea((p) => ({ ...p, precio: e.target.value }))
                      }
                      placeholder="0.00"
                      className={`${INPUT} pl-7`}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAgregarLinea}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-60 transition-colors font-medium"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5" />
                    )}
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      setShowAddLinea(false);
                      setNewLinea({ descripcion: "", precio: "" });
                    }}
                    className="px-4 py-2 text-xs border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancelar
                  </button>

                  {/* Inventario â€” prÃ³ximamente */}
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                    <Package className="w-3.5 h-3.5" />
                    <span>Desde inventario</span>
                    <span className="px-1.5 py-0.5 bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 rounded text-[10px] font-semibold">
                      PrÃ³ximamente
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* --- COLUMNA DERECHA (1/3): Resumen + Acciones --- */}
        <div className="space-y-4">
          {/* Resumen de informaciÃ³n */}
          <section className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                InformaciÃ³n
              </h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {/* VehÃ­culo */}
              <div className="flex gap-3 px-4 py-3">
                <Car className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">
                    VehÃ­culo
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {localOrden.vehiculo?.patente ?? "â€”"}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {[
                      localOrden.vehiculo?.marca,
                      localOrden.vehiculo?.modelo,
                      localOrden.vehiculo?.anio,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    {localOrden.vehiculo?.color
                      ? ` Â· ${localOrden.vehiculo.color}`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Cliente */}
              {localOrden.vehiculo?.cliente && (
                <div className="flex gap-3 px-4 py-3">
                  <User className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">
                      Cliente
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {localOrden.vehiculo.cliente.nombre}{" "}
                      {localOrden.vehiculo.cliente.apellido}
                    </p>
                    {localOrden.vehiculo.cliente.telefono && (
                      <p className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {localOrden.vehiculo.cliente.telefono}
                      </p>
                    )}
                    {localOrden.vehiculo.cliente.email && (
                      <p className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <Mail className="w-3 h-3" />
                        {localOrden.vehiculo.cliente.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TÃ©cnico */}
              <div className="flex gap-3 px-4 py-3">
                <Wrench className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">
                    TÃ©cnico asignado
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {[localOrden.usuario?.nombre, localOrden.usuario?.apellido]
                      .filter(Boolean)
                      .join(" ") || "â€”"}
                  </p>
                </div>
              </div>

              {/* Fechas */}
              <div className="flex gap-3 px-4 py-3">
                <Calendar className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <div className="space-y-2 w-full">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Ingreso
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {new Date(localOrden.fechaCreacion).toLocaleDateString(
                        "es-AR",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Entrega estimada
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {new Date(localOrden.fechaEntrega).toLocaleDateString(
                        "es-AR",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-700/30">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  Total orden
                </span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white tabular-nums">
                  ${totalActual.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </section>

          {/* Acciones de workflow */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              Acciones
            </h3>

            {localOrden.estado === "PENDIENTE" && (
              <button
                onClick={() => handleCambiarEstado("EN_PROGRESO")}
                disabled={saving}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-60 transition-colors font-medium shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                  Iniciar trabajo
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>
            )}

            {localOrden.estado === "EN_PROGRESO" && (
              <button
                onClick={() => handleCambiarEstado("COMPLETADA")}
                disabled={saving}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm bg-success-500 text-white rounded-xl hover:bg-success-600 disabled:opacity-60 transition-colors font-medium shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCheck className="w-4 h-4" />
                  )}
                  Marcar como completada
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>
            )}

            {(localOrden.estado === "PENDIENTE" ||
              localOrden.estado === "EN_PROGRESO") && (
              <button
                onClick={() => handleCambiarEstado("CANCELADA")}
                disabled={saving}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm border border-error-300 dark:border-error-800 text-error-600 dark:text-error-400 rounded-xl hover:bg-error-50 dark:hover:bg-error-900/20 disabled:opacity-60 transition-colors font-medium"
              >
                <Ban className="w-4 h-4" />
                Cancelar orden
              </button>
            )}

            {localOrden.estado === "COMPLETADA" && (
              <div className="flex items-start gap-2.5 p-3 bg-success-50 dark:bg-success-900/10 rounded-xl border border-success-200 dark:border-success-800">
                <CheckCircle2 className="w-5 h-5 text-success-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-success-700 dark:text-success-300">
                    Orden completada
                  </p>
                  <p className="text-xs text-success-600 dark:text-success-400 mt-0.5">
                    El vehÃ­culo estÃ¡ listo para ser retirado por el cliente.
                  </p>
                </div>
              </div>
            )}

            {localOrden.estado === "CANCELADA" && (
              <div className="flex items-start gap-2.5 p-3 bg-error-50 dark:bg-error-900/10 rounded-xl border border-error-200 dark:border-error-800">
                <AlertTriangle className="w-5 h-5 text-error-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-error-700 dark:text-error-300">
                    Orden cancelada
                  </p>
                  <p className="text-xs text-error-600 dark:text-error-400 mt-0.5">
                    Esta orden ya no estÃ¡ activa.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </Modal>
  );
}
