import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Car, Loader2 } from "lucide-react";
import { OrderCard } from "./OrderCard";
import { OrderForm } from "./OrderForm";
import { Button } from "../../components/common/Button";
import { SearchInput } from "../../components/common/SearchInput";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { Modal } from "../../components/common/Modal";
import { obtenerOrdenes } from "../../api/ordenApi";
import { Orden } from "../../types/orden";

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapEstado(
  estado: string,
): "pending" | "in_progress" | "completed" | "ready_for_pickup" {
  switch (estado) {
    case "EN_PROGRESO":
      return "in_progress";
    case "COMPLETADA":
      return "completed";
    case "CANCELADA":
      return "ready_for_pickup";
    default:
      return "pending";
  }
}

const TIMELINE_STEPS = [
  "Ingreso",
  "Diagnóstico",
  "Reparación",
  "Control de Calidad",
  "Listo para entrega",
];

const DONE_BY_ESTADO: Record<string, number> = {
  PENDIENTE: 1,
  EN_PROGRESO: 2,
  COMPLETADA: 5,
  CANCELADA: 1,
};

function mapOrdenToCard(o: Orden) {
  const doneCount = DONE_BY_ESTADO[o.estado] ?? 1;
  return {
    id: o.numeroOrden || `OT-${o.id}`,
    vehicleInfo: {
      plate: o.vehiculo?.patente ?? "—",
      model: [o.vehiculo?.marca, o.vehiculo?.modelo, o.vehiculo?.anio]
        .filter(Boolean)
        .join(" "),
      client: [o.vehiculo?.cliente?.nombre, o.vehiculo?.cliente?.apellido]
        .filter(Boolean)
        .join(" ") || "—",
      phone: o.vehiculo?.cliente?.telefono ?? "—",
    },
    status: mapEstado(o.estado),
    priority: "medium" as const,
    description: o.descripcion ?? "",
    createdAt: new Date(o.fechaCreacion),
    estimatedCompletion: new Date(o.fechaEntrega),
    assignedTechnician:
      [o.usuario?.nombre, o.usuario?.apellido].filter(Boolean).join(" ") ||
      "—",
    parts: (o.lineasServicio ?? []).map((ls) => ({
      id: String(ls.id ?? Math.random()),
      name: ls.descripcion,
      quantity: 1,
      price: ls.precio ?? 0,
    })),
    timeline: TIMELINE_STEPS.map((step, i) => ({
      step,
      completed: i < doneCount,
      date:
        i < doneCount ? new Date(o.fechaCreacion) : (null as Date | null),
    })),
  };
}

// ── Componente ────────────────────────────────────────────────────────────────

export function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarOrdenes = useCallback(() => {
    setLoading(true);
    setError(null);
    obtenerOrdenes()
      .then(setOrdenes)
      .catch(() => setError("No se pudieron cargar las órdenes"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "pending", label: "Pendiente" },
    { value: "in_progress", label: "En Progreso" },
    { value: "completed", label: "Completado" },
    { value: "ready_for_pickup", label: "Listo para retirar" },
  ];

  const cards = ordenes.map(mapOrdenToCard);

  const filteredCards = cards.filter((order) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(q) ||
      order.vehicleInfo.plate.toLowerCase().includes(q) ||
      order.vehicleInfo.client.toLowerCase().includes(q) ||
      order.vehicleInfo.model.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main
      className="p-4 lg:p-6"
      role="main"
      aria-label="Gestión de órdenes de trabajo"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Órdenes de Trabajo
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gestión de reparaciones y servicios del taller
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowForm(true)}
          className="bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          Nueva Orden
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por OT, patente, cliente o modelo..."
          className="flex-1"
        />
        <SearchableSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          placeholder="Todos los estados"
          className="w-52"
        />
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-neutral-500 dark:text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando órdenes...</span>
        </div>
      ) : error ? (
        <div className="text-center py-14">
          <p className="text-error-500 mb-3">{error}</p>
          <button
            onClick={cargarOrdenes}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredCards.length === 0 ? (
            <div className="col-span-full text-center py-14">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
              </div>
              <p className="text-neutral-500 dark:text-neutral-400">
                {ordenes.length === 0
                  ? "No hay órdenes registradas aún"
                  : "No se encontraron órdenes con esos criterios"}
              </p>
            </div>
          ) : (
            filteredCards.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      )}

      {/* Modal Nueva Orden */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nueva Orden de Trabajo"
        icon={
          <Car className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="4xl"
        noPadding
      >
        <OrderForm
          onClose={() => setShowForm(false)}
          onSuccess={cargarOrdenes}
        />
      </Modal>
    </main>
  );
}

