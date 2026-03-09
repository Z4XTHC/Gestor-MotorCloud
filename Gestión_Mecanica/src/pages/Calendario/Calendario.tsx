import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Car,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { obtenerOrdenes } from "../../api/ordenApi";
import { Orden } from "../../types/orden";
import { OrderDetalles } from "../Ordenes/OrderDetalles";

// ─── helpers ────────────────────────────────────────────────────────────────

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function toYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Configuración visual por estado */
const ESTADO_CONFIG: Record<
  string,
  { label: string; dot: string; badge: string; icon: React.ReactNode }
> = {
  PENDIENTE: {
    label: "Pendiente",
    dot: "bg-warning-500",
    badge:
      "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
    icon: <Clock className="w-3 h-3" />,
  },
  EN_PROGRESO: {
    label: "En progreso",
    dot: "bg-primary-500",
    badge:
      "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
    icon: <Wrench className="w-3 h-3" />,
  },
  COMPLETADA: {
    label: "Completada",
    dot: "bg-success-500",
    badge:
      "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  CANCELADA: {
    label: "Cancelada",
    dot: "bg-red-400",
    badge: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    icon: <XCircle className="w-3 h-3" />,
  },
};

function estadoConfig(estado: string) {
  return ESTADO_CONFIG[estado] ?? ESTADO_CONFIG["PENDIENTE"];
}

// ─── componente ─────────────────────────────────────────────────────────────

export function Calendario() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string>(toYMD(today));
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);

  const cargarOrdenes = () => {
    setLoading(true);
    obtenerOrdenes()
      .then(setOrdenes)
      .catch(() => setError("No se pudieron cargar las órdenes de trabajo."))
      .finally(() => setLoading(false));
  };

  // Cargar OTs al montar
  useEffect(() => {
    cargarOrdenes();
  }, []);

  // Agrupar OTs por fechaEntrega: { "2026-03-09": Orden[] }
  const otPorFecha = useMemo(() => {
    const map: Record<string, Orden[]> = {};
    for (const ot of ordenes) {
      if (!ot.status) continue; // ignorar inactivas
      const key = ot.fechaEntrega?.slice(0, 10);
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(ot);
    }
    return map;
  }, [ordenes]);

  // OTs del día seleccionado
  const otsDiaSeleccionado = otPorFecha[selectedDate] ?? [];

  // Navegación mes
  const prevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Celdas del calendario (incluye días vacíos al inicio)
  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Dom
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<Date | null> = [
      ...Array(firstDay).fill(null),
      ...Array.from(
        { length: daysInMonth },
        (_, i) => new Date(year, month, i + 1),
      ),
    ];
    return cells;
  }, [viewDate]);

  const todayYMD = toYMD(today);

  return (
    <main
      className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500"
      role="main"
      aria-label="Calendario de Órdenes de Trabajo"
    >
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="text-primary-500" />
            Agenda de Trabajos
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Visualizá las Órdenes de Trabajo organizadas por fecha de entrega.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Navegación mes */}
          <div className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors text-neutral-600 dark:text-neutral-400"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-neutral-700 dark:text-neutral-200 min-w-[150px] text-center capitalize">
              {MESES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors text-neutral-600 dark:text-neutral-400"
              aria-label="Mes siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            onClick={() =>
              setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
            }
            className="px-3 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            Hoy
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Calendario Principal ── */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-soft overflow-hidden">
          {/* Cabecera días */}
          <div className="grid grid-cols-7 border-b border-primary-200 dark:border-neutral-800 bg-primary-600 dark:bg-neutral-900/50">
            {DIAS_SEMANA.map((d) => (
              <div
                key={d}
                className="py-3 text-center text-xs font-black text-white uppercase tracking-widest"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Celdas */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-neutral-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Cargando órdenes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {calendarCells.map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[90px] lg:min-h-[110px] p-2 border-r border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30"
                    />
                  );
                }

                const ymd = toYMD(day);
                const ots = otPorFecha[ymd] ?? [];
                const isToday = ymd === todayYMD;
                const isSelected = ymd === selectedDate;
                const hasOTs = ots.length > 0;

                return (
                  <button
                    key={ymd}
                    onClick={() => setSelectedDate(ymd)}
                    className={`min-h-[90px] lg:min-h-[110px] p-2 border-r border-b border-neutral-200 dark:border-neutral-800 text-left transition-colors
                      ${isSelected ? "bg-primary-50 dark:bg-primary-950/20 ring-2 ring-inset ring-primary-400" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/30"}
                    `}
                  >
                    {/* Número de día */}
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold
                        ${isToday ? "bg-primary-500 text-white" : isSelected ? "text-primary-600 dark:text-primary-400" : "text-neutral-500 dark:text-neutral-400"}
                      `}
                    >
                      {day.getDate()}
                    </span>

                    {/* Indicadores de OTs */}
                    {hasOTs && (
                      <div className="mt-1 space-y-0.5">
                        {/* Mostrar hasta 2 OTs, el resto como "+N" */}
                        {ots.slice(0, 2).map((ot) => {
                          const cfg = estadoConfig(ot.estado);
                          return (
                            <div
                              key={ot.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrden(ot);
                              }}
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${cfg.badge}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`}
                              />
                              {ot.numeroOrden}
                            </div>
                          );
                        })}
                        {ots.length > 2 && (
                          <div className="text-[10px] font-bold text-neutral-400 px-1">
                            +{ots.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Panel lateral: OTs del día seleccionado ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary-500" />
              {selectedDate === todayYMD
                ? "Hoy"
                : new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "es-AR",
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )}
            </h3>
            <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
              {otsDiaSeleccionado.length} OT
              {otsDiaSeleccionado.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Lista OTs */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              </div>
            ) : otsDiaSeleccionado.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                <CalendarIcon className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm font-medium">Sin órdenes para este día</p>
              </div>
            ) : (
              otsDiaSeleccionado.map((ot) => {
                const cfg = estadoConfig(ot.estado);
                const cliente = ot.vehiculo?.cliente;
                return (
                  <div
                    key={ot.id}
                    onClick={() => setSelectedOrden(ot)}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:border-primary-300 dark:hover:border-primary-800 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-tighter">
                        {ot.numeroOrden}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.badge}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>

                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm group-hover:text-primary-500 transition-colors">
                      {cliente ? `${cliente.nombre} ${cliente.apellido}` : "—"}
                    </h4>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Car size={12} className="shrink-0" />
                        {ot.vehiculo?.marca} {ot.vehiculo?.modelo} (
                        {ot.vehiculo?.patente})
                      </div>
                      {ot.usuario && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Wrench size={12} className="shrink-0" />
                          {ot.usuario.nombre} {ot.usuario.apellido}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Modal detalle OT ── */}
      <OrderDetalles
        orden={selectedOrden}
        onClose={() => setSelectedOrden(null)}
        onSuccess={() => {
          cargarOrdenes();
        }}
      />

      {/* ── Leyenda de estados ── */}
      <div className="flex flex-wrap gap-3 pt-2">
        {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => (
          <div
            key={key}
            className="flex items-center gap-1.5 text-xs text-neutral-500"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        ))}
      </div>
    </main>
  );
}
