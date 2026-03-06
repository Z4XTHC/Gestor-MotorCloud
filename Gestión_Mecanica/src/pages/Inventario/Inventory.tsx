import { useState, useEffect } from "react";
import { Package, AlertTriangle, Plus, RotateCcw, Edit } from "lucide-react";
import { Column, Table } from "../../components/common/Table";
import { TableSkeleton } from "../../components/common/TableSkeleton";
import { Button } from "../../components/common/Button";
import { SearchInput } from "../../components/common/SearchInput";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { Modal } from "../../components/common/Modal";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
  status: "ok" | "low" | "critical";
}

const columns: Column[] = [
  { key: "name", label: "Repuesto" },
  { key: "category", label: "Categoría" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Estado" },
  { key: "price", label: "Precio" },
  { key: "supplier", label: "Proveedor" },
  { key: "actions", label: "Acciones", align: "right" },
];

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Filtro de Aceite",
    category: "Filtros",
    stock: 25,
    minStock: 10,
    price: 8500,
    supplier: "AutoParts SA",
    status: "ok" as const,
  },
  {
    id: "2",
    name: "Pastillas de Freno",
    category: "Frenos",
    stock: 8,
    minStock: 15,
    price: 45000,
    supplier: "BrakeMax",
    status: "low" as const,
  },
  {
    id: "3",
    name: "Bujías NGK",
    category: "Encendido",
    stock: 2,
    minStock: 20,
    price: 12000,
    supplier: "NGK Chile",
    status: "critical" as const,
  },
  {
    id: "4",
    name: "Aceite Motor 5W30",
    category: "Lubricantes",
    stock: 50,
    minStock: 25,
    price: 18000,
    supplier: "Shell",
    status: "ok" as const,
  },
  {
    id: "5",
    name: "Amortiguador Delantero",
    category: "Suspensión",
    stock: 6,
    minStock: 8,
    price: 85000,
    supplier: "Monroe",
    status: "low" as const,
  },
  {
    id: "6",
    name: "Batería 12V",
    category: "Eléctrico",
    stock: 0,
    minStock: 5,
    price: 95000,
    supplier: "Bosch",
    status: "critical" as const,
  },
];

const getStatusBadge = (status: string, stock: number) => {
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

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categoryOptions = [
    { value: "all", label: "Todas las categorías" },
    ...Array.from(new Set(mockInventory.map((item) => item.category))).map(
      (cat) => ({
        value: cat,
        label: cat,
      }),
    ),
  ];

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "ok", label: "Stock OK" },
    { value: "low", label: "Stock Bajo" },
    { value: "critical", label: "Stock Crítico" },
  ];

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderRow = (item: InventoryItem) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {item.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              ID: {item.id}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-neutral-900 dark:text-white">
          {item.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            {item.stock} unidades
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Mínimo: {item.minStock}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(item.status, item.stock)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-neutral-900 dark:text-white">
          ${item.price.toLocaleString()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-neutral-900 dark:text-white">
          {item.supplier}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Reponer Stock"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
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
            onClick={() => setShowAddModal(true)}
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
            placeholder="Buscar repuestos, categorías o proveedores..."
            className="flex-1"
          />
          <div className="flex gap-3 lg:gap-4">
            <SearchableSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="Todas las categorías"
              className="w-48"
            />
            <SearchableSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              placeholder="Todos los estados"
              className="w-44"
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
                  {mockInventory.length}
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
                  {mockInventory.filter((i) => i.status === "ok").length}
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
                  {mockInventory.filter((i) => i.status === "low").length}
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
                  {mockInventory.filter((i) => i.status === "critical").length}
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
        <Table<InventoryItem>
          columns={columns}
          data={filteredInventory}
          loading={false}
          search={searchTerm}
          isFiltering={selectedCategory !== "all" || selectedStatus !== "all"}
          emptyMessage="No se encontraron repuestos que coincidan con los criterios de búsqueda"
          emptyIcon={
            <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
          }
          renderRow={renderRow}
        />
      )}

      {/* Modal Agregar Repuesto */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Repuesto"
        icon={
          <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
      >
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Formulario para agregar repuesto (próximamente).
        </p>
      </Modal>
    </main>
  );
}
