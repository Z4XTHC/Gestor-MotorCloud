import { useState, useEffect, useCallback } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Column, Table } from "../../components/common/Table";
import { TableSkeleton } from "../../components/common/TableSkeleton";
import { Button } from "../../components/common/Button";
import { SearchInput } from "../../components/common/SearchInput";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { Modal } from "../../components/common/Modal";
import { Inventario } from "../../types/inventario";
import {
  obtenerInventario,
  actualizarEstadoInventario,
} from "../../api/inventarioApi";
import { InventarioForm } from "./InventarioForm";
import { InventarioDetalles } from "./InventarioDetalles";
import { confirmarEliminarInventario } from "./InventarioConfirm";
import { showError } from "../../components/common/SweetAlert";

type StockStatus = "ok" | "low" | "critical";

const getStockStatus = (stock: number): StockStatus => {
  if (stock === 0) return "critical";
  if (stock <= 5) return "critical";
  if (stock <= 10) return "low";
  return "ok";
};

const getStatusBadge = (stock: number) => {
  const status = getStockStatus(stock);
  switch (status) {
    case "ok":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          Stock OK
        </span>
      );
    case "low":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
          <AlertTriangle className="w-3 h-3" />
          Stock Bajo
        </span>
      );
    case "critical":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs font-medium rounded-full">
          <AlertTriangle className="w-3 h-3" />
          {stock === 0 ? "Sin Stock" : "Stock Crítico"}
        </span>
      );
    default:
      return null;
  }
};

const columns: Column[] = [
  { key: "nombre", label: "Repuesto" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Estado Stock" },
  { key: "precio", label: "Precio" },
  { key: "costo", label: "Costo" },
  { key: "activo", label: "Activo" },
  { key: "actions", label: "Acciones", align: "right" },
];

const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "ok", label: "Stock OK" },
  { value: "low", label: "Stock Bajo" },
  { value: "critical", label: "Stock Crítico" },
];

export function Inventory() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventario | null>(null);
  const [editingItem, setEditingItem] = useState<Inventario | null>(null);

  const fetchInventario = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerInventario();
      setInventario(data);
    } catch (_) {
      showError("Error", "No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventario();
  }, [fetchInventario]);

  const handleToggleStatus = async (item: Inventario) => {
    try {
      await actualizarEstadoInventario({
        id: String(item.id),
        status: !item.status,
      });
      fetchInventario();
    } catch (_) {
      showError("Error", "No se pudo cambiar el estado del repuesto.");
    }
  };

  const filteredInventory = inventario.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const stockStatus = getStockStatus(item.stock);
    const matchesStatus =
      selectedStatus === "all" || stockStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderRow = (item: Inventario) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {item.nombre}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
              {item.descripcion || `ID: ${item.id}`}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-neutral-900 dark:text-white">
          {item.stock} unidades
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(item.stock)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-neutral-900 dark:text-white">
          ${item.precio.toLocaleString()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          ${item.costo.toLocaleString()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            item.status
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${item.status ? "bg-green-500" : "bg-red-500"}`}
          />
          {item.status ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setSelectedItem(item)}
            className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingItem(item);
              setShowAddModal(true);
            }}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(item)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title={item.status ? "Desactivar" : "Activar"}
          >
            {item.status ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() =>
              confirmarEliminarInventario(item.id, item.nombre, fetchInventario)
            }
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <main className="p-4 lg:p-6" role="main" aria-label="Gestión de inventario">
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Gestión de Inventario
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Control de repuestos y suministros del taller
            </p>
          </div>
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingItem(null);
              setShowAddModal(true);
            }}
            className="bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-400 dark:hover:bg-primary-500 transition-colors"
          >
            Agregar Repuesto
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar repuestos o descripción..."
            className="flex-1"
          />
          <div className="flex gap-3 lg:gap-4">
            <SearchableSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              placeholder="Todos los estados"
              className="w-48"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {inventario.length}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total Repuestos
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {
                    inventario.filter((i) => getStockStatus(i.stock) === "ok")
                      .length
                  }
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Stock OK
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {
                    inventario.filter((i) => getStockStatus(i.stock) === "low")
                      .length
                  }
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Stock Bajo
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {
                    inventario.filter(
                      (i) => getStockStatus(i.stock) === "critical",
                    ).length
                  }
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Stock Crítico
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton columns={7} rows={6} />
      ) : (
        <Table<Inventario>
          columns={columns}
          data={filteredInventory}
          loading={false}
          search={searchTerm}
          isFiltering={selectedStatus !== "all"}
          emptyMessage="No se encontraron repuestos que coincidan con los criterios de búsqueda"
          emptyIcon={
            <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
          }
          renderRow={renderRow}
        />
      )}

      {/* Modal Agregar / Editar Repuesto */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? "Editar Repuesto" : "Agregar Repuesto"}
        icon={
          <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <InventarioForm
          inventario={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSuccess={fetchInventario}
        />
      </Modal>

      {/* Modal Detalles */}
      <InventarioDetalles
        inventario={selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={(item) => {
          setSelectedItem(null);
          setEditingItem(item);
          setShowAddModal(true);
        }}
      />
    </main>
  );
}
