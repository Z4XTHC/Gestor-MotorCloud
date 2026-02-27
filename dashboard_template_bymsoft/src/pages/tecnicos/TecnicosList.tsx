import { useEffect, useState } from "react";
import {
  obtenerTecnicos,
  eliminarTecnico,
  Tecnico,
} from "../../api/tecnicosApi";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loading } from "../../components/common/Loading";
import { Input } from "../../components/common/Input";
import { Column, Table } from "../../components/common/Table";
import { TecnicoForm } from "./TecnicoForm";
import { TecnicosDetalles } from "./TecnicosDetalles";
import { confirmarEliminarTecnico } from "./TecnicosConfirm";

export const TecnicosList = () => {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Tecnico | null>(null);
  const [editing, setEditing] = useState<Tecnico | null>(null);
  const [showForm, setShowForm] = useState(false);
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Ordenamiento
  const [sortField, setSortField] = useState<
    "nombre" | "apellido" | "email" | "telefono" | "cuit" | "createdAt" | null
  >("nombre");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    "asc",
  );

  useEffect(() => {
    obtenerTecnicos()
      .then(setTecnicos)
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    obtenerTecnicos()
      .then(setTecnicos)
      .finally(() => setLoading(false));
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await confirmarEliminarTecnico(id, refresh);
  };

  // Filtros y búsqueda
  const filteredTecnicos = tecnicos.filter((tecnico) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        tecnico.nombre?.toLowerCase().includes(searchLower) ||
        tecnico.email?.toLowerCase().includes(searchLower) ||
        tecnico.telefono?.toLowerCase().includes(searchLower) ||
        tecnico.apellido?.toLowerCase().includes(searchLower) ||
        tecnico.cuit?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Ordenar
  const sortedTecnicos = [...filteredTecnicos].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    let aValue = a[sortField] || "";
    let bValue = b[sortField] || "";
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const totalPages = Math.ceil(sortedTecnicos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTecnicos = sortedTecnicos.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const handleSort = (
    field: "nombre" | "apellido" | "email" | "telefono" | "cuit" | "createdAt",
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (
    field: "nombre" | "apellido" | "email" | "telefono" | "cuit" | "createdAt",
  ) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-5 h-5 ml-1 opacity-40" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="w-5 h-5 ml-1" />;
    }
    return <ArrowDown className="w-5 h-5 ml-1" />;
  };

  const columns: Column[] = [
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "apellido", label: "Apellido", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "cuit", label: "CUIT", sortable: true },
    { key: "telefono", label: "Teléfono", sortable: true },
    { key: "acciones", label: "Acciones", align: "center" },
  ];

  if (loading) return <Loading message="Cargando técnicos..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
            Técnicos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de técnicos
          </p>
        </div>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowForm(true)}
        >
          Nuevo Técnico
        </Button>
      </div>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Mostrar:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
              </select>
              <span className="text-sm text-gray-600">técnicos por página</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Total: {sortedTecnicos.length} técnico
            {sortedTecnicos.length !== 1 ? "s" : ""}
          </div>
        </div>
        <Table
          columns={columns}
          data={paginatedTecnicos}
          loading={loading}
          search={search}
          isFiltering={!!search}
          emptyMessage={(search) =>
            search
              ? `No se encontraron resultados para "${search}"`
              : "No hay técnicos registrados"
          }
          onSort={handleSort}
          getSortIcon={getSortIcon}
          pagination={{
            currentPage,
            setCurrentPage,
            itemsPerPage,
            totalItems: sortedTecnicos.length,
            label: "técnicos",
          }}
          renderRow={(tecnico) => (
            <>
              <td className="py-4 px-4 text-gray-900 font-medium">
                {tecnico.nombre || "-"}
              </td>
              <td className="py-4 px-4 text-gray-600">
                {tecnico.apellido || "-"}
              </td>
              <td className="py-4 px-4 text-gray-600">
                {tecnico.email || "-"}
              </td>
              <td className="py-4 px-4 text-gray-600">{tecnico.cuit || "-"}</td>
              <td className="py-4 px-4 text-gray-600">
                {tecnico.telefono || "-"}
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelected(tecnico)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-celeste-dark dark:text-dark-primary"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditing(tecnico);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-primary dark:text-dark-primary"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tecnico._id || tecnico.id)}
                    className="p-2 hover:bg-coral/20 rounded-lg transition-colors text-coral"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </Card>

      {/* Modal de detalles */}
      {selected && (
        <TecnicosDetalles
          tecnico={selected}
          onClose={() => setSelected(null)}
          onEdit={(t) => {
            setSelected(null);
            setEditing(t);
            setShowForm(true);
          }}
        />
      )}

      {/* Modal de Edición/Creación */}
      {showForm && (
        <TecnicoForm
          tecnico={editing}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
};
