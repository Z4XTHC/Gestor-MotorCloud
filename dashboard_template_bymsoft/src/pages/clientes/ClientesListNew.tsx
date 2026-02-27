import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loading } from "../../components/common/Loading";
import { Input } from "../../components/common/Input";
import { Cliente } from "../../types";
import clienteApi from "../../api/clienteApi";
import rubroApi from "../../api/rubroApi";
import { Rubro } from "../../types/rubro";
import Swal from "sweetalert2";
import { useCache } from "../../contexts/CacheContext";
import { ClientesDetalles } from "./ClientesDetalles";
import { ClientesForm } from "./ClientesForm";
import { confirmarEliminarCliente } from "./ClientesConfirm";
import { Select } from "../../components/common/Select";
import { Column, Table } from "../../components/common/Table";

type SortField = "razonSocial" | "rubro" | "cuit" | "createdAt" | "status";
type SortDirection = "asc" | "desc" | null;

export const ClientesList = () => {
  const {
    getClientes,
    setClientes: setCacheClientes,
    isCacheValid,
    clearCache,
  } = useCache();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rubroFilter, setRubroFilter] = useState<string>("");
  const [estadoFilter, setEstadoFilter] = useState<string>("");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Ordenamiento - Por defecto ordenar por fecha de alta descendente (más recientes primero)
  const [sortField, setSortField] = useState<SortField | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const fetchClientes = async () => {
    // Intentar usar caché primero
    const cachedClientes = getClientes();
    if (cachedClientes && isCacheValid("clientes")) {
      setClientes(cachedClientes);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await clienteApi.obtenerClientes();
      setClientes(data);
      setCacheClientes(data); // Guardar en caché
    } catch (error) {
      console.error("Error loading clientes:", error);
      setClientes([]); // Asegurar que siempre sea un array
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los clientes",
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRubros = async () => {
    try {
      const data = await rubroApi.obtenerRubros();
      setRubros(data);
    } catch (error) {
      console.error("Error loading rubros:", error);
    }
  };

  // Función para refrescar después de cualquier cambio (invalida caché y recarga)
  const refreshAfterChange = async () => {
    clearCache(); // Invalidar todo el caché para forzar recarga
    setLoading(true);
    try {
      const data = await clienteApi.obtenerClientes();
      setClientes(data);
      setCacheClientes(data);
    } catch (error) {
      console.error("Error refreshing clientes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron recargar los clientes",
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchRubros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  {
    /* Const de Columnas para las Tablas */
  }
  const columnasClientes: Column[] = [
    { key: "razonSocial", label: "Razón Social" },
    { key: "rubro", label: "Rubro" },
    { key: "cuit", label: "CUIT" },
    {
      key: "createdAt",
      label: "Fecha de Alta",
      align: "center",
      sortable: true,
    },
    { key: "status", label: "Estado", align: "center", sortable: true },
    { key: "acciones", label: "Acciones", align: "center" },
  ];

  // Filtrar clientes del lado del cliente
  const filteredClientes = clientes.filter((cliente) => {
    // Filtro de búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        cliente.nombreFantasia?.toLowerCase().includes(searchLower) ||
        cliente.razonSocial?.toLowerCase().includes(searchLower) ||
        cliente.cuit?.toLowerCase().includes(searchLower) ||
        cliente.email?.toLowerCase().includes(searchLower) ||
        cliente.rubro?.nombre?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Filtro de rubro
    if (rubroFilter && cliente.rubro?._id !== rubroFilter) {
      return false;
    }

    // Filtro de estado
    if (estadoFilter !== "") {
      const isActive = cliente.status?.toLowerCase().includes("activado");
      if (estadoFilter === "activo" && !isActive) return false;
      if (estadoFilter === "inactivo" && isActive) return false;
    }

    return true;
  });

  // Ordenar clientes
  const sortedClientes = [...filteredClientes].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "razonSocial":
        aValue = a.razonSocial?.toLowerCase() || "";
        bValue = b.razonSocial?.toLowerCase() || "";
        break;
      case "rubro":
        aValue = a.rubro?.nombre?.toLowerCase() || "";
        bValue = b.rubro?.nombre?.toLowerCase() || "";
        break;
      case "cuit":
        aValue = a.cuit || "";
        bValue = b.cuit || "";
        break;
      case "createdAt":
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        break;
      case "status":
        aValue = a.status?.toLowerCase() || "";
        bValue = b.status?.toLowerCase() || "";
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const totalPages = Math.ceil(sortedClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClientes = sortedClientes.slice(startIndex, endIndex);

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, rubroFilter, estadoFilter, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Si ya está ordenado por este campo, cambiar dirección o quitar orden
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      // Nuevo campo, empezar con ascendente
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-5 h-5 ml-1 opacity-40" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="w-5 h-5 ml-1" />;
    }
    return <ArrowDown className="w-5 h-5 ml-1" />;
  };

  const handleDelete = async (id: string) => {
    await confirmarEliminarCliente(id, refreshAfterChange);
  };

  const handleEditFromDetails = (cliente: Cliente) => {
    setSelectedCliente(null);
    setEditingCliente(cliente);
  };

  const handleResendActivation = async (clienteId: string) => {
    if (!clienteId) return;

    const confirm = await Swal.fire({
      title: "Re-enviar activación",
      text: "¿Desea reenviar el correo de activación a este cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F39F23",
      confirmButtonText: "Sí, reenviar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await clienteApi.reenviarActivacion(clienteId);
      Swal.fire({
        icon: "success",
        title: "Enviado",
        text: "El correo de activación fue reenviado.",
        confirmButtonColor: "#F39F23",
      });
      fetchClientes();
    } catch (error) {
      console.error("Error reenviando activación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo reenviar el correo de activación.",
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Cargando clientes..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
            Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de clientes y sucursales
          </p>
        </div>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowCreateModal(true)}
        >
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda por texto */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, CUIT o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por Rubro */}
            <div>
              <Select
                value={rubroFilter}
                onChange={(e) => setRubroFilter(e.target.value)}
                className="border-neutral-light dark:border-dark-bg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:border-transparent focus:ring-primary"
              >
                <option value="">Todos los rubros</option>
                {rubros.map((rubro) => (
                  <option key={rubro._id} value={rubro._id}>
                    {rubro.nombre}
                  </option>
                ))}
              </Select>
            </div>

            {/* Filtro por Estado */}
            <div>
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activado</option>
                <option value="inactivo">Sin activar</option>
              </select>
            </div>
          </div>

          {/* Selector de items por página */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mostrar:
              </span>
              <Select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
              </Select>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                clientes por página
              </span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {sortedClientes.length} cliente
              {sortedClientes.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Tabla de Clientes */}
        <Table
          columns={columnasClientes}
          data={paginatedClientes}
          loading={loading}
          search={search}
          isFiltering={!!search}
          emptyMessage={(search) =>
            search
              ? `No se encontraron resultados para "${search}"`
              : "Lo siento, no hay clientes registrados"
          }
          onSort={handleSort}
          getSortIcon={getSortIcon}
          pagination={{
            currentPage,
            setCurrentPage,
            itemsPerPage,
            totalItems: sortedClientes.length,
            label: "clientes",
          }}
          renderRow={(cliente, index) => (
            <>
              <td className="py-4 px-4 text-gray-900 dark:text-dark-text font-medium">
                {cliente.razonSocial}
              </td>
              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                {cliente.rubro?.nombre || "-"}
              </td>
              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                {cliente.cuit}
              </td>
              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                {cliente.createdAt
                  ? new Date(cliente.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <td className="py-4 px-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    cliente.status?.toLowerCase().includes("activado")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {cliente.status || "Sin estado"}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  {/** Mostrar botón de reenvío sólo si el usuario NO está activado **/}
                  {!cliente.status?.toLowerCase().includes("activado") && (
                    <button
                      onClick={() =>
                        handleResendActivation(cliente._id || cliente.id || "")
                      }
                      className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-yellow-600"
                      title="Re-enviar activación"
                      aria-label="Re-enviar correo de activación"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCliente(cliente)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-celeste-dark dark:text-dark-primary"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingCliente(cliente)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-primary dark:text-dark-primary"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(cliente._id || cliente.id || "")
                    }
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

      {/* Modal de detalles del cliente */}
      {selectedCliente && (
        <ClientesDetalles
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
          onEdit={handleEditFromDetails}
        />
      )}

      {/* Modal de Edición */}
      {editingCliente && (
        <ClientesForm
          cliente={editingCliente}
          onClose={() => setEditingCliente(null)}
          onSuccess={refreshAfterChange}
        />
      )}

      {/* Modal de Creación */}
      {showCreateModal && (
        <ClientesForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={refreshAfterChange}
        />
      )}
    </div>
  );
};
