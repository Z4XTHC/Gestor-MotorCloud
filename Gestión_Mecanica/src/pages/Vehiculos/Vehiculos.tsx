import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Eye,
  Car,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Column, Table } from "../../components/common/Table";
import { TableSkeleton } from "../../components/common/TableSkeleton";
import { Button } from "../../components/common/Button";
import { SearchInput } from "../../components/common/SearchInput";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { Modal } from "../../components/common/Modal";
import {
  showConfirm,
  showSuccess,
  showError,
} from "../../components/common/SweetAlert";
import { Vehiculo } from "../../types/vehiculo";
import { Cliente } from "../../types/cliente";
import {
  obtenerVehiculos,
  actualizarEstadoVehiculo,
} from "../../api/vehiculoApi";
import { obtenerClientes } from "../../api/clienteApi";
import { VehiculosForm } from "./VehiculosForm";
import { VehiculosDetalles } from "./VehiculosDetalles";

type SortField = "marca" | "modelo" | "patente" | "anio";
type SortDirection = "asc" | "desc" | null;

export const VehiculosList = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(
    null,
  );
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>("marca");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehs, clts] = await Promise.all([
        obtenerVehiculos(),
        obtenerClientes(),
      ]);
      setVehiculos(vehs);
      setClientes(clts);
    } catch {
      showError("Error", "No se pudieron cargar los vehículos.");
      setVehiculos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, estadoFilter, itemsPerPage]);

  const getNombreCliente = (v: Vehiculo) => {
    // Primero intenta con el objeto anidado, luego con el alias clienteId
    const clienteId = v.cliente?.id ?? v.clienteId;
    const nombre = v.cliente?.nombre;
    const apellido = v.cliente?.apellido;
    if (nombre) return `${nombre} ${apellido ?? ""}`.trim();
    const found = clientes.find((c) => c.id === clienteId);
    return found
      ? `${found.nombre} ${found.apellido}`
      : clienteId
        ? `ID: ${clienteId}`
        : "—";
  };

  const columnas: Column[] = [
    { key: "vehiculo", label: "Vehículo", sortable: true },
    { key: "patente", label: "Patente", align: "center", sortable: true },
    { key: "cliente", label: "Propietario", sortable: true },
    { key: "anio", label: "Año", align: "center", sortable: true },
    { key: "status", label: "Estado", align: "center", sortable: true },
    { key: "acciones", label: "Acciones", align: "right" },
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = vehiculos.filter((v) => {
      if (search) {
        const s = search.toLowerCase();
        const clienteId = v.cliente?.id ?? v.clienteId;
        const cliente = clientes.find((c) => c.id === clienteId);
        const nombreCliente = v.cliente?.nombre
          ? `${v.cliente.nombre} ${v.cliente.apellido ?? ""}`.toLowerCase()
          : cliente
            ? `${cliente.nombre} ${cliente.apellido}`.toLowerCase()
            : "";
        const ok =
          v.marca?.toLowerCase().includes(s) ||
          v.modelo?.toLowerCase().includes(s) ||
          v.patente?.toLowerCase().includes(s) ||
          v.color?.toLowerCase().includes(s) ||
          nombreCliente.includes(s);
        if (!ok) return false;
      }
      if (estadoFilter === "activo" && !v.status) return false;
      if (estadoFilter === "inactivo" && v.status) return false;
      return true;
    });

    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: string | number = "";
        let bVal: string | number = "";
        switch (sortField) {
          case "marca":
            aVal = `${a.marca} ${a.modelo}`.toLowerCase();
            bVal = `${b.marca} ${b.modelo}`.toLowerCase();
            break;
          case "modelo":
            aVal = a.modelo?.toLowerCase() ?? "";
            bVal = b.modelo?.toLowerCase() ?? "";
            break;
          case "patente":
            aVal = a.patente?.toLowerCase() ?? "";
            bVal = b.patente?.toLowerCase() ?? "";
            break;
          case "anio":
            aVal = a.anio;
            bVal = b.anio;
            break;
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [vehiculos, clientes, search, estadoFilter, sortField, sortDirection]);

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
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    if (sortDirection === "asc") return <ArrowUp className="w-4 h-4 ml-1" />;
    if (sortDirection === "desc") return <ArrowDown className="w-4 h-4 ml-1" />;
    return <ArrowUpDown className="w-4 h-4 ml-1" />;
  };

  const handleToggleStatus = async (vehiculo: Vehiculo) => {
    const nuevoEstado = !vehiculo.status;
    const accion = nuevoEstado ? "activar" : "desactivar";
    const res = await showConfirm(
      `¿${nuevoEstado ? "Activar" : "Desactivar"} vehículo?`,
      `¿Deseas ${accion} la patente ${vehiculo.patente}?`,
      `Sí, ${accion}`,
      "Cancelar",
    );
    if (!res.isConfirmed) return;
    try {
      await actualizarEstadoVehiculo({
        id: String(vehiculo.id),
        status: nuevoEstado,
      });
      showSuccess(
        nuevoEstado ? "Activado" : "Desactivado",
        "Estado del vehículo actualizado.",
        1800,
      );
      fetchData();
    } catch {
      showError("Error", `No se pudo ${accion} el vehículo.`);
    }
  };

  const handleEditFromDetails = (v: Vehiculo) => {
    setSelectedVehiculo(null);
    setEditingVehiculo(v);
  };

  const estadoOptions = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];
  const itemsPerPageOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "20", label: "20" },
  ];

  return (
    <main className="p-4 lg:p-6" role="main">
      {/* === ENCABEZADO === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Vehículos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Registro de vehículos del taller
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          Nuevo Vehículo
        </Button>
      </div>

      {/* === FILTROS === */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por marca, modelo, patente o propietario..."
          className="flex-1"
        />
        <div className="flex gap-3">
          <SearchableSelect
            value={estadoFilter}
            onChange={setEstadoFilter}
            options={estadoOptions}
            placeholder="Todos los estados"
            className="w-48"
          />
          <SearchableSelect
            value={String(itemsPerPage)}
            onChange={(v) => setItemsPerPage(Number(v))}
            options={itemsPerPageOptions}
            placeholder="10"
            className="w-20"
          />
        </div>
      </div>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        {totalItems}{" "}
        {totalItems === 1 ? "vehículo encontrado" : "vehículos encontrados"}
      </p>

      {/* === TABLA === */}
      {loading ? (
        <TableSkeleton columns={columnas.length} rows={itemsPerPage} />
      ) : (
        <Table
          columns={columnas}
          data={paginatedData}
          loading={false}
          search={search}
          isFiltering={!!search || !!estadoFilter}
          emptyMessage={(s) =>
            s
              ? `No se encontraron vehículos para "${s}"`
              : "No hay vehículos registrados"
          }
          onSort={handleSort}
          getSortIcon={getSortIcon}
          pagination={{
            currentPage,
            setCurrentPage,
            itemsPerPage,
            totalItems,
            label: "vehículos",
          }}
          renderRow={(v) => (
            <>
              {/* Vehículo (marca + modelo + color) */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900 dark:text-white">
                      {v.marca} {v.modelo}
                    </p>
                    {v.color && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {v.color}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Patente */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="font-mono font-bold text-sm tracking-widest text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                  {v.patente}
                </span>
              </td>

              {/* Propietario */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {getNombreCliente(v)}
                </span>
              </td>

              {/* Año */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="text-sm text-neutral-900 dark:text-white">
                  {v.anio}
                </span>
              </td>

              {/* Estado toggle */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => handleToggleStatus(v)}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    v.status
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200"
                  }`}
                  title={v.status ? "Desactivar" : "Activar"}
                >
                  {v.status ? (
                    <ToggleRight className="w-3.5 h-3.5" />
                  ) : (
                    <ToggleLeft className="w-3.5 h-3.5" />
                  )}
                  {v.status ? "Activo" : "Inactivo"}
                </button>
              </td>

              {/* Acciones */}
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => setSelectedVehiculo(v)}
                    className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingVehiculo(v)}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      )}

      {/* ===== MODALES ===== */}

      {/* Detalles */}
      <VehiculosDetalles
        vehiculo={selectedVehiculo}
        clientes={clientes}
        onClose={() => setSelectedVehiculo(null)}
        onEdit={handleEditFromDetails}
      />

      {/* Editar */}
      <Modal
        isOpen={!!editingVehiculo}
        onClose={() => setEditingVehiculo(null)}
        title="Editar Vehículo"
        icon={
          <Car className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <VehiculosForm
          vehiculo={editingVehiculo}
          onClose={() => setEditingVehiculo(null)}
          onSuccess={() => {
            setEditingVehiculo(null);
            showSuccess(
              "Actualizado",
              "Vehículo actualizado correctamente.",
              2000,
            );
            fetchData();
          }}
        />
      </Modal>

      {/* Crear */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nuevo Vehículo"
        icon={
          <Car className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <VehiculosForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            showSuccess(
              "Registrado",
              "Vehículo registrado correctamente.",
              2000,
            );
            fetchData();
          }}
        />
      </Modal>
    </main>
  );
};
