import { useState, useEffect } from "react";
import {
  Search,
  User,
  Plus,
  Phone,
  Car,
  Mail,
  MapPin,
  CreditCard,
  Edit,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { TableSkeleton } from "../../components/common/TableSkeleton";
import {
  showSuccess,
  showError,
  showConfirm,
} from "../../components/common/SweetAlert";
import { Cliente } from "../../types/cliente";
import { obtenerClientes, actualizarEstadoCliente } from "../../api/clienteApi";
import { ClientesForm } from "./ClientesForm";
import { VehiculosForm } from "../Vehiculos/VehiculosForm";

export function Clients() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  // Modales
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  // Flujo: tras crear cliente, preguntar si agregar vehículo
  const [clienteRecienCreado, setClienteRecienCreado] =
    useState<Cliente | null>(null);
  const [showVehiculoForm, setShowVehiculoForm] = useState(false);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch {
      showError("Error", "No se pudo cargar la lista de clientes.");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClients = clientes.filter(
    (c) =>
      `${c.nombre} ${c.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (c.dni || "").includes(searchTerm) ||
      (c.telefono || "").includes(searchTerm) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // === Flujo post-creación de cliente ===
  const handleClienteCreado = async (nuevoCliente?: Cliente) => {
    await fetchClientes();
    if (!nuevoCliente) return;
    setSelectedClient(nuevoCliente);

    const res = await showConfirm(
      "¿Agregar un vehículo?",
      `El cliente ${nuevoCliente.nombre} ${nuevoCliente.apellido} fue creado exitosamente.\n¿Deseas registrar un vehículo ahora?`,
      "Sí, agregar vehículo",
      "No, después",
    );

    if (res.isConfirmed) {
      setClienteRecienCreado(nuevoCliente);
      setShowVehiculoForm(true);
    } else {
      showSuccess(
        "Cliente creado",
        `${nuevoCliente.nombre} ${nuevoCliente.apellido} fue registrado correctamente.`,
        2000,
      );
    }
  };

  const handleClienteEditado = async (clienteActualizado?: Cliente) => {
    await fetchClientes();
    if (clienteActualizado) {
      setSelectedClient(clienteActualizado);
      showSuccess(
        "Actualizado",
        "Los datos del cliente fueron actualizados.",
        2000,
      );
    }
  };

  const handleVehiculoAgregado = () => {
    showSuccess(
      "Vehículo registrado",
      "El vehículo fue registrado y vinculado al cliente.",
      2000,
    );
    setClienteRecienCreado(null);
    setShowVehiculoForm(false);
  };

  const handleToggleStatus = async (cliente: Cliente) => {
    const nuevoEstado = !cliente.status;
    const accion = nuevoEstado ? "activar" : "desactivar";
    const res = await showConfirm(
      `¿${nuevoEstado ? "Activar" : "Desactivar"} cliente?`,
      `¿Deseas ${accion} a ${cliente.nombre} ${cliente.apellido}?`,
      `Sí, ${accion}`,
      "Cancelar",
    );
    if (!res.isConfirmed) return;
    try {
      await actualizarEstadoCliente({
        id: String(cliente.id),
        status: nuevoEstado,
      });
      showSuccess(
        nuevoEstado ? "Activado" : "Desactivado",
        "Estado del cliente actualizado.",
        1800,
      );
      await fetchClientes();
      if (selectedClient?.id === cliente.id) {
        setSelectedClient((prev) =>
          prev ? { ...prev, status: nuevoEstado } : null,
        );
      }
    } catch {
      showError("Error", `No se pudo ${accion} el cliente.`);
    }
  };

  return (
    <main className="p-4 lg:p-6" role="main">
      {/* === ENCABEZADO === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Gestión de Clientes
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {loading
              ? "Cargando..."
              : `${clientes.length} cliente${clientes.length !== 1 ? "s" : ""} registrado${clientes.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          Nuevo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* ===== PANEL IZQUIERDO: Lista de clientes ===== */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-4">
                <TableSkeleton columns={1} rows={5} />
              </div>
            ) : (
              <div className="max-h-[560px] overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {searchTerm
                        ? `Sin resultados para "${searchTerm}"`
                        : "No hay clientes registrados"}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredClients.map((cliente) => (
                      <button
                        key={cliente.id}
                        onClick={() => setSelectedClient(cliente)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          selectedClient?.id === cliente.id
                            ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              cliente.status
                                ? "bg-primary-100 dark:bg-primary-900/20"
                                : "bg-neutral-100 dark:bg-neutral-700"
                            }`}
                          >
                            <User
                              className={`w-4 h-4 ${
                                cliente.status
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-neutral-400 dark:text-neutral-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                                {cliente.nombre} {cliente.apellido}
                              </span>
                              {!cliente.status && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 shrink-0">
                                  Inactivo
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              {cliente.dni} • {cliente.telefono}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== PANEL DERECHO: Detalle del cliente ===== */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="space-y-4 lg:space-y-5">
              {/* Cabecera del cliente */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                          {selectedClient.nombre} {selectedClient.apellido}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            selectedClient.status
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {selectedClient.status ? (
                            <ToggleRight className="w-3 h-3" />
                          ) : (
                            <ToggleLeft className="w-3 h-3" />
                          )}
                          {selectedClient.status ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <p className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5" />{" "}
                          {selectedClient.dni}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />{" "}
                          {selectedClient.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" />{" "}
                          {selectedClient.telefono}
                        </p>
                        {selectedClient.direccion && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />{" "}
                            {selectedClient.direccion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      icon={<Edit className="w-4 h-4" />}
                      variant="outline"
                      onClick={() => setEditingCliente(selectedClient)}
                    >
                      Editar
                    </Button>
                    <button
                      onClick={() => handleToggleStatus(selectedClient)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        selectedClient.status
                          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {selectedClient.status ? (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5" /> Desactivar
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-3.5 h-3.5" /> Activar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Vehículos */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    Vehículos Registrados
                    {selectedClient.vehiculos &&
                      selectedClient.vehiculos.length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                          {selectedClient.vehiculos.length}
                        </span>
                      )}
                  </h3>
                  <Button
                    icon={<PlusCircle className="w-4 h-4" />}
                    variant="outline"
                    onClick={() => {
                      setClienteRecienCreado(selectedClient);
                      setShowVehiculoForm(true);
                    }}
                    className="border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    Agregar Vehículo
                  </Button>
                </div>
                {selectedClient.vehiculos &&
                selectedClient.vehiculos.length > 0 ? (
                  <div className="space-y-2">
                    {selectedClient.vehiculos.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center shrink-0">
                          <Car className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-neutral-900 dark:text-white">
                            {v.marca} {v.modelo}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Patente:{" "}
                            <span className="font-mono font-bold tracking-wider">
                              {v.patente}
                            </span>{" "}
                            • {v.anio} • {v.color}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            v.status
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {v.status ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-400 dark:text-neutral-500">
                    <Car className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Sin vehículos registrados</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <div className="p-12 text-center">
                <User className="w-14 h-14 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Selecciona un cliente
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Elige un cliente de la lista para ver su información y
                  vehículos registrados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL: Crear Cliente ===== */}
      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Nuevo Cliente"
        icon={
          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <ClientesForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={(nuevo) => {
            setShowCreateForm(false);
            handleClienteCreado(nuevo);
          }}
        />
      </Modal>

      {/* ===== MODAL: Editar Cliente ===== */}
      <Modal
        isOpen={!!editingCliente}
        onClose={() => setEditingCliente(null)}
        title="Editar Cliente"
        icon={
          <Edit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <ClientesForm
          cliente={editingCliente}
          onClose={() => setEditingCliente(null)}
          onSuccess={(actualizado) => {
            setEditingCliente(null);
            handleClienteEditado(actualizado);
          }}
        />
      </Modal>

      {/* ===== MODAL: Agregar Vehículo (flujo post-cliente) ===== */}
      <Modal
        isOpen={showVehiculoForm}
        onClose={() => {
          setShowVehiculoForm(false);
          setClienteRecienCreado(null);
        }}
        title="Registrar Vehículo"
        icon={
          <Car className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <VehiculosForm
          clientePreseleccionado={clienteRecienCreado}
          onClose={() => {
            setShowVehiculoForm(false);
            setClienteRecienCreado(null);
          }}
          onSuccess={handleVehiculoAgregado}
        />
      </Modal>
    </main>
  );
}
