import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Plus,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { TableSkeleton } from "../../components/common/TableSkeleton";
import {
  showSuccess,
  showError,
  showConfirm,
} from "../../components/common/SweetAlert";
import { Proveedor } from "../../types/proveedor";
import {
  obtenerProveedores,
  actualizarEstadoProveedor,
} from "../../api/proveedorApi";
import { ProveedoresForm } from "./ProveedoresForm";
import { confirmarEliminarProveedor } from "./ProveedoresConfirm";

export const Proveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProveedor, setSelectedProveedor] =
    useState<Proveedor | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(
    null,
  );

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const data = await obtenerProveedores();
      setProveedores(data);
    } catch {
      showError("Error", "No se pudo cargar la lista de proveedores.");
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const filteredProveedores = proveedores.filter(
    (p) =>
      (p.razonSocial || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.cuit || "").includes(searchTerm) ||
      (p.telefono || "").includes(searchTerm) ||
      (p.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleProveedorCreado = async (nuevo?: Proveedor) => {
    await fetchProveedores();
    if (nuevo) {
      setSelectedProveedor(nuevo);
      showSuccess(
        "Proveedor creado",
        `${nuevo.razonSocial} fue registrado correctamente.`,
        2000,
      );
    }
  };

  const handleProveedorEditado = async (actualizado?: Proveedor) => {
    await fetchProveedores();
    if (actualizado) {
      setSelectedProveedor(actualizado);
      showSuccess("Actualizado", "Los datos del proveedor fueron actualizados.", 2000);
    }
  };

  const handleToggleStatus = async (proveedor: Proveedor) => {
    const nuevoEstado = !proveedor.status;
    const accion = nuevoEstado ? "activar" : "desactivar";
    const res = await showConfirm(
      `¿${nuevoEstado ? "Activar" : "Desactivar"} proveedor?`,
      `¿Deseas ${accion} a "${proveedor.razonSocial}"?`,
      `Sí, ${accion}`,
      "Cancelar",
    );
    if (!res.isConfirmed) return;
    try {
      await actualizarEstadoProveedor({
        id: String(proveedor.id),
        status: nuevoEstado,
      });
      showSuccess(
        nuevoEstado ? "Activado" : "Desactivado",
        "Estado del proveedor actualizado.",
        1800,
      );
      await fetchProveedores();
      if (selectedProveedor?.id === proveedor.id) {
        setSelectedProveedor((prev) =>
          prev ? { ...prev, status: nuevoEstado } : null,
        );
      }
    } catch {
      showError("Error", `No se pudo ${accion} el proveedor.`);
    }
  };

  return (
    <main className="p-4 lg:p-6" role="main">
      {/* === ENCABEZADO === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Gestión de Proveedores
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {loading
              ? "Cargando..."
              : `${proveedores.length} proveedor${proveedores.length !== 1 ? "es" : ""} registrado${proveedores.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          Nuevo Proveedor
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* ===== PANEL IZQUIERDO: Lista de proveedores ===== */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, CUIT, email..."
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
                {filteredProveedores.length === 0 ? (
                  <div className="p-8 text-center">
                    <Building2 className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {searchTerm
                        ? `Sin resultados para "${searchTerm}"`
                        : "No hay proveedores registrados"}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredProveedores.map((proveedor) => (
                      <button
                        key={proveedor.id}
                        onClick={() => setSelectedProveedor(proveedor)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          selectedProveedor?.id === proveedor.id
                            ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              proveedor.status
                                ? "bg-primary-100 dark:bg-primary-900/20"
                                : "bg-neutral-100 dark:bg-neutral-700"
                            }`}
                          >
                            <Building2
                              className={`w-4 h-4 ${
                                proveedor.status
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-neutral-400 dark:text-neutral-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                                {proveedor.razonSocial}
                              </span>
                              {!proveedor.status && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 shrink-0">
                                  Inactivo
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              {proveedor.cuit} • {proveedor.telefono || "Sin teléfono"}
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

        {/* ===== PANEL DERECHO: Detalle del proveedor ===== */}
        <div className="lg:col-span-2">
          {selectedProveedor ? (
            <div className="space-y-4 lg:space-y-5">
              {/* Cabecera del proveedor */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center shrink-0">
                      <Building2 className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                          {selectedProveedor.razonSocial}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            selectedProveedor.status
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {selectedProveedor.status ? (
                            <ToggleRight className="w-3 h-3" />
                          ) : (
                            <ToggleLeft className="w-3 h-3" />
                          )}
                          {selectedProveedor.status ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <p className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5" />
                          CUIT: {selectedProveedor.cuit || "-"}
                        </p>
                        {selectedProveedor.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            {selectedProveedor.email}
                          </p>
                        )}
                        {selectedProveedor.telefono && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            {selectedProveedor.telefono}
                          </p>
                        )}
                        {selectedProveedor.direccion && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {selectedProveedor.direccion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      icon={<Edit className="w-4 h-4" />}
                      variant="outline"
                      onClick={() => setEditingProveedor(selectedProveedor)}
                    >
                      Editar
                    </Button>
                    <button
                      onClick={() => handleToggleStatus(selectedProveedor)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        selectedProveedor.status
                          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {selectedProveedor.status ? (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5" /> Desactivar
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-3.5 h-3.5" /> Activar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        confirmarEliminarProveedor(
                          String(selectedProveedor.id),
                          selectedProveedor.razonSocial,
                          () => {
                            setSelectedProveedor(null);
                            fetchProveedores();
                          },
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  Datos del Proveedor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">ID</p>
                    <p className="text-sm text-neutral-900 dark:text-white">#{selectedProveedor.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">CUIT</p>
                    <p className="text-sm font-mono text-neutral-900 dark:text-white">{selectedProveedor.cuit || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Teléfono</p>
                    <p className="text-sm text-neutral-900 dark:text-white">{selectedProveedor.telefono || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm text-neutral-900 dark:text-white">{selectedProveedor.email || "-"}</p>
                  </div>
                  {selectedProveedor.direccion && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Dirección</p>
                      <p className="text-sm text-neutral-900 dark:text-white">{selectedProveedor.direccion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <div className="p-12 text-center">
                <Building2 className="w-14 h-14 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Selecciona un proveedor
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Elige un proveedor de la lista para ver su información de contacto
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL: Crear Proveedor ===== */}
      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Nuevo Proveedor"
        icon={
          <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <ProveedoresForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={(nuevo) => {
            setShowCreateForm(false);
            handleProveedorCreado(nuevo);
          }}
        />
      </Modal>

      {/* ===== MODAL: Editar Proveedor ===== */}
      <Modal
        isOpen={!!editingProveedor}
        onClose={() => setEditingProveedor(null)}
        title="Editar Proveedor"
        icon={
          <Edit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <ProveedoresForm
          proveedor={editingProveedor}
          onClose={() => setEditingProveedor(null)}
          onSuccess={(actualizado) => {
            setEditingProveedor(null);
            handleProveedorEditado(actualizado);
          }}
        />
      </Modal>
    </main>
  );
};
