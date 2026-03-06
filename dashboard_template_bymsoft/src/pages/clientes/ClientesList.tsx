import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Loading } from "../../components/common/Loading";
import { Input } from "../../components/common/Input";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { Column, Table } from "../../components/common/Table";
import Swal from "sweetalert2";
import { showError } from "../../components/common/SweetAlert";
import { Cliente } from "../../types/cliente";
import { obtenerClientes, actualizarEstadoCliente } from "../../api/clienteApi";
import { ClientesDetalles } from "./ClientesDetalles";
import { ClientesForm } from "./ClientesForm";
import { confirmarEliminarClientes } from "./ClientesConfirm";

type SortField =
  | "id"
  | "dni"
  | "nombre"
  | "apellido"
  | "email"
  | "telefono"
  | "direccion"
  | "status";
type SortDirection = "asc" | "desc" | null;

export const ClientesList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>("apellido");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch {
      setClientes([]);
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

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, estadoFilter, itemsPerPage]);

  const columnas: Column[] = [
    { key: "dni", label: "DNI", sortable: true },
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "apellido", label: "Apellido", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "telefono", label: "Teléfono", sortable: true },
    { key: "direccion", label: "Dirección", sortable: true },
    { key: "status", label: "Estado", align: "center", sortable: true },
    { key: "acciones", label: "Acciones", align: "center" },
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = clientes.filter((c) => {
      if (search) {
        const s = search.toLowerCase();
        const ok =
          c.dni?.toLowerCase().includes(s) ||
          c.nombre?.toLowerCase().includes(s) ||
          c.apellido?.toLowerCase().includes(s) ||
          c.email?.toLowerCase().includes(s) ||
          c.telefono?.toLowerCase().includes(s) ||
          c.direccion?.toLowerCase().includes(s);
        if (!ok) return false;
      }
      if (estadoFilter !== "") {
        if (estadoFilter === "activo" && !c.status) return false;
        if (estadoFilter === "inactivo" && c.status) return false;
      }
      return true;
    });

    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: string | number = "";
        let bVal: string | number = "";
        switch (sortField) {
          case "id":
            aVal = a.id;
            bVal = b.id;
            break;
          case "dni":
            aVal = a.dni?.toLowerCase() ?? "";
            bVal = b.dni?.toLowerCase() ?? "";
            break;
          case "nombre":
            aVal = a.nombre?.toLowerCase() ?? "";
            bVal = b.nombre?.toLowerCase() ?? "";
            break;
          case "apellido":
            aVal = a.apellido?.toLowerCase() ?? "";
            bVal = b.apellido?.toLowerCase() ?? "";
            break;
          case "email":
            aVal = a.email?.toLowerCase() ?? "";
            bVal = b.email?.toLowerCase() ?? "";
            break;
          case "telefono":
            aVal = a.telefono?.toLowerCase() ?? "";
            bVal = b.telefono?.toLowerCase() ?? "";
            break;
          case "direccion":
            aVal = a.direccion?.toLowerCase() ?? "";
            bVal = b.direccion?.toLowerCase() ?? "";
            break;
          case "status":
            aVal = a.status ? 1 : 0;
            bVal = b.status ? 1 : 0;
            break;
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [clientes, search, estadoFilter, sortField, sortDirection]);

  const totalItems = filteredAndSortedData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else setSortDirection("asc");
    } else {
      setSortField(field as SortField);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    if (sortDirection === "asc") return <ArrowUp className="w-4 h-4" />;
    if (sortDirection === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  const handleDelete = async (id: number) => {
    await confirmarEliminarClientes(String(id), fetchClientes);
  };

  const handleToggleStatus = async (cliente: Cliente) => {
    const nuevoEstado = !cliente.status;
    const accion = nuevoEstado ? "activar" : "desactivar";
    const result = await Swal.fire({
      title: `¿${nuevoEstado ? "Activar" : "Desactivar"} cliente?`,
      text: `¿Desea ${accion} a ${cliente.nombre} ${cliente.apellido}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F39F23",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await actualizarEstadoCliente({
        id: String(cliente.id),
        status: nuevoEstado,
      });
      Swal.fire({
        icon: "success",
        title: nuevoEstado ? "Activado" : "Desactivado",
        text: `El cliente fue ${nuevoEstado ? "activado" : "desactivado"} correctamente.`,
        timer: 1800,
        showConfirmButton: false,
      });
      fetchClientes();
    } catch {
      showError("Error", `No se pudo ${accion} el cliente.`);
    }
  };

  const handleEditFromDetails = (c: Cliente) => {
    setSelectedCliente(null);
    setEditingCliente(c);
  };

  if (loading) return <Loading message="Cargando clientes..." />;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-1">
            Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de clientes del sistema
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
          {/* Filtros */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por DNI, nombre, apellido, email, teléfono o dirección..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Estado:
              </span>
              <SearchableSelect
                value={estadoFilter}
                onChange={setEstadoFilter}
                options={[
                  { value: "", label: "Todos" },
                  { value: "activo", label: "Activo" },
                  { value: "inactivo", label: "Inactivo" },
                ]}
                placeholder="Filtrar estado"
                className="min-w-[130px]"
              />
            </div>
          </div>

          {/* Items por página y contador */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mostrar:
              </span>
              <SearchableSelect
                value={itemsPerPage.toString()}
                onChange={(v) => setItemsPerPage(Number(v))}
                options={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "15", label: "15" },
                  { value: "20", label: "20" },
                ]}
                placeholder="10"
                className="min-w-[80px]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                registros por página
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {totalItems} cliente{totalItems !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <Table
          columns={columnas}
          data={paginatedData}
          loading={loading}
          search={search}
          isFiltering={!!search || !!estadoFilter}
          emptyMessage={(s) =>
            s
              ? `No se encontraron resultados para "${s}"`
              : "No hay clientes registrados"
          }
          onSort={handleSort}
          getSortIcon={getSortIcon}
          pagination={{
            currentPage,
            setCurrentPage,
            itemsPerPage,
            totalItems,
            label: "clientes",
          }}
          renderRow={(c) => (
            <>
              <td className="py-4 px-4 text-gray-900 dark:text-dark-text font-medium">
                {c.dni || "-"}
              </td>
              <td className="py-4 px-4 text-gray-900 dark:text-dark-text">
                {c.nombre}
              </td>
              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                {c.apellido}
              </td>
              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                {c.email || "-"}
              </td>
              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                {c.telefono || "-"}
              </td>
              <td
                className="py-4 px-4 text-gray-600 dark:text-gray-400 max-w-[180px] truncate"
                title={c.direccion}
              >
                {c.direccion || "-"}
              </td>
              <td className="py-4 px-4 text-center">
                <span
                  className={
                    c.status
                      ? "inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }
                >
                  {c.status ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedCliente(c)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-blue-600"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingCliente(c)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-primary dark:text-dark-primary"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(c)}
                    className={`p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors ${c.status ? "text-green-600" : "text-gray-400"}`}
                    title={c.status ? "Desactivar cliente" : "Activar cliente"}
                  >
                    {c.status ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500"
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

      {selectedCliente && (
        <ClientesDetalles
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
          onEdit={handleEditFromDetails}
        />
      )}

      {editingCliente && (
        <ClientesForm
          cliente={editingCliente}
          onClose={() => setEditingCliente(null)}
          onSuccess={fetchClientes}
        />
      )}

      {showCreateModal && (
        <ClientesForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchClientes}
        />
      )}
    </div>
  );
};
