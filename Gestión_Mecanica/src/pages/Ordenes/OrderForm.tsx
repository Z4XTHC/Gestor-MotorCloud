import React, { useState, useEffect } from "react";
import {
  User,
  Car,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  UserPlus,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { ColorSelect } from "../../components/common/ColorSelect";
import { showError, showSuccess } from "../../components/common/SweetAlert";
import { Cliente } from "../../types/cliente";
import { Vehiculo } from "../../types/vehiculo";
import { Usuario } from "../../types/usuario";
import { obtenerClientes, crearCliente } from "../../api/clienteApi";
import {
  obtenerVehiculosPorCliente,
  crearVehiculo,
} from "../../api/vehiculoApi";
import { obtenerUsuarios } from "../../api/userApi";
import { crearOrden } from "../../api/ordenApi";
import {
  obtenerTodasLasMarcas,
  obtenerModelosPorMarca,
} from "../../api/NHTSAapi";

interface OrderFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 1 | 2 | 3;

interface LineaForm {
  tempId: string;
  descripcion: string;
  precio: string;
}

const INPUT_CLASS =
  "w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none";

const LABEL_CLASS =
  "block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1";

export function OrderForm({ onClose, onSuccess }: OrderFormProps) {
  // ── pasos ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);

  // ── Step 1: Cliente ────────────────────────────────────────────────────
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    dni: "",
  });
  const [savingCliente, setSavingCliente] = useState(false);

  // ── Step 2: Vehículo ───────────────────────────────────────────────────
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(
    null,
  );
  const [showNewVehiculo, setShowNewVehiculo] = useState(false);
  const [vehiculoForm, setVehiculoForm] = useState({
    marca: "",
    modelo: "",
    anio: "",
    color: "",
    patente: "",
  });
  const [savingVehiculo, setSavingVehiculo] = useState(false);
  const [marcas, setMarcas] = useState<{ value: string; label: string }[]>([]);
  const [loadingMarcas, setLoadingMarcas] = useState(false);
  const [modelos, setModelos] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [loadingModelos, setLoadingModelos] = useState(false);

  // ── Step 3: Servicio ───────────────────────────────────────────────────
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [servicioForm, setServicioForm] = useState({
    descripcion: "",
    fechaEntrega: "",
    estado: "PENDIENTE",
    mecanicoId: "",
  });
  const [lineas, setLineas] = useState<LineaForm[]>([
    { tempId: "1", descripcion: "", precio: "" },
  ]);
  const [saving, setSaving] = useState(false);

  // ── Cargar clientes al montar ──────────────────────────────────────────
  useEffect(() => {
    setLoadingClientes(true);
    obtenerClientes()
      .then(setClientes)
      .catch(() => showError("Error", "No se pudieron cargar los clientes"))
      .finally(() => setLoadingClientes(false));
  }, []);

  // ── Cargar vehículos cuando cambia el cliente ──────────────────────────
  useEffect(() => {
    if (!selectedCliente) {
      setVehiculos([]);
      return;
    }
    setLoadingVehiculos(true);
    setSelectedVehiculo(null);
    obtenerVehiculosPorCliente(String(selectedCliente.id))
      .then(setVehiculos)
      .catch(() => showError("Error", "No se pudieron cargar los vehículos"))
      .finally(() => setLoadingVehiculos(false));
  }, [selectedCliente]);

  // ── Cargar marcas NHTSA cuando se muestra el form de vehículo ─────────
  useEffect(() => {
    if (!showNewVehiculo || marcas.length > 0) return;
    setLoadingMarcas(true);
    obtenerTodasLasMarcas()
      .then((list) =>
        setMarcas(list.map((m) => ({ value: m.Make_Name, label: m.Make_Name }))),
      )
      .catch(() => {})
      .finally(() => setLoadingMarcas(false));
  }, [showNewVehiculo, marcas.length]);

  // ── Cargar modelos cuando cambia la marca ─────────────────────────────
  useEffect(() => {
    if (!vehiculoForm.marca) {
      setModelos([]);
      return;
    }
    setLoadingModelos(true);
    obtenerModelosPorMarca(vehiculoForm.marca)
      .then((list) =>
        setModelos(
          list.map((m) => ({ value: m.Model_Name, label: m.Model_Name })),
        ),
      )
      .catch(() => setModelos([]))
      .finally(() => setLoadingModelos(false));
  }, [vehiculoForm.marca]);

  // ── Cargar técnicos al llegar al paso 3 ──────────────────────────────
  useEffect(() => {
    if (step !== 3 || usuarios.length > 0) return;
    setLoadingUsuarios(true);
    obtenerUsuarios()
      .then(setUsuarios)
      .catch(() => showError("Error", "No se pudieron cargar los técnicos"))
      .finally(() => setLoadingUsuarios(false));
  }, [step, usuarios.length]);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleGuardarCliente = async () => {
    if (!clienteForm.nombre || !clienteForm.apellido || !clienteForm.telefono) {
      showError(
        "Campos requeridos",
        "Nombre, apellido y teléfono son obligatorios",
      );
      return;
    }
    setSavingCliente(true);
    try {
      const nuevo = await crearCliente({ ...clienteForm, status: true });
      setClientes((prev) => [...prev, nuevo]);
      setSelectedCliente(nuevo);
      setShowNewCliente(false);
      setClienteForm({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        dni: "",
      });
    } catch {
      showError("Error", "No se pudo crear el cliente");
    } finally {
      setSavingCliente(false);
    }
  };

  const handleGuardarVehiculo = async () => {
    if (
      !vehiculoForm.marca ||
      !vehiculoForm.modelo ||
      !vehiculoForm.patente ||
      !vehiculoForm.anio
    ) {
      showError(
        "Campos requeridos",
        "Marca, modelo, patente y año son obligatorios",
      );
      return;
    }
    if (!selectedCliente) return;
    setSavingVehiculo(true);
    try {
      const nuevo = await crearVehiculo({
        marca: vehiculoForm.marca,
        modelo: vehiculoForm.modelo,
        anio: Number(vehiculoForm.anio),
        color: vehiculoForm.color,
        patente: vehiculoForm.patente.toUpperCase(),
        status: true,
        cliente: { id: selectedCliente.id },
      });
      setVehiculos((prev) => [...prev, nuevo]);
      setSelectedVehiculo(nuevo);
      setShowNewVehiculo(false);
      setVehiculoForm({ marca: "", modelo: "", anio: "", color: "", patente: "" });
    } catch {
      showError("Error", "No se pudo crear el vehículo");
    } finally {
      setSavingVehiculo(false);
    }
  };

  const handleAddLinea = () => {
    setLineas((prev) => [
      ...prev,
      { tempId: String(Date.now()), descripcion: "", precio: "" },
    ]);
  };

  const handleRemoveLinea = (tempId: string) => {
    setLineas((prev) => prev.filter((l) => l.tempId !== tempId));
  };

  const handleLineaChange = (
    tempId: string,
    field: "descripcion" | "precio",
    value: string,
  ) => {
    setLineas((prev) =>
      prev.map((l) => (l.tempId === tempId ? { ...l, [field]: value } : l)),
    );
  };

  const totalCalc = lineas.reduce(
    (sum, l) => sum + (parseFloat(l.precio) || 0),
    0,
  );

  const handleSubmit = async () => {
    if (!selectedVehiculo || !selectedCliente) return;
    if (!servicioForm.fechaEntrega || !servicioForm.mecanicoId) {
      showError(
        "Campos requeridos",
        "Fecha de entrega y técnico son obligatorios",
      );
      return;
    }
    const lineasValidas = lineas.filter(
      (l) => l.descripcion.trim() && l.precio,
    );
    setSaving(true);
    try {
      await crearOrden({
        numeroOrden: `OT-${Date.now().toString(36).toUpperCase()}`,
        fechaCreacion: new Date().toISOString().split("T")[0],
        fechaEntrega: servicioForm.fechaEntrega,
        descripcion:
          servicioForm.descripcion ||
          lineasValidas.map((l) => l.descripcion).join(", "),
        estado: servicioForm.estado,
        vehiculo: { id: selectedVehiculo.id },
        usuario: { id: Number(servicioForm.mecanicoId) },
        status: true,
        lineasServicio: lineasValidas.map((l) => ({
          descripcion: l.descripcion,
          precio: parseFloat(l.precio),
        })),
      });
      showSuccess("¡Orden creada!", "La orden fue registrada exitosamente");
      onSuccess?.();
      onClose();
    } catch {
      showError("Error", "No se pudo crear la orden de trabajo");
    } finally {
      setSaving(false);
    }
  };

  // ── Opciones para selects ─────────────────────────────────────────────

  const clienteOptions = clientes.map((c) => ({
    value: String(c.id),
    label: `${c.nombre} ${c.apellido} — ${c.telefono}`,
  }));

  const vehiculoOptions = vehiculos.map((v) => ({
    value: String(v.id),
    label: `${v.patente} — ${v.marca} ${v.modelo} ${v.anio}`,
  }));

  const usuarioOptions = usuarios.map((u) => ({
    value: String(u.id),
    label: `${u.nombre} ${u.apellido}`,
  }));

  const STEPS = [
    { num: 1, label: "Cliente", icon: User },
    { num: 2, label: "Vehículo", icon: Car },
    { num: 3, label: "Servicio", icon: Wrench },
  ] as const;

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="h-[70vh] flex flex-col">
      {/* ── Indicador de pasos ── */}
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isDone
                        ? "bg-success-500 text-white"
                        : isActive
                          ? "bg-primary-500 text-white"
                          : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`hidden sm:block text-sm font-medium ${
                      isActive
                        ? "text-primary-600 dark:text-primary-400"
                        : isDone
                          ? "text-success-600 dark:text-success-400"
                          : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-3 ${
                      step > s.num
                        ? "bg-success-400"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Contenido del paso ── */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ═══════════════ PASO 1: CLIENTE ═══════════════ */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-primary-500" />
              Seleccionar Cliente
            </h3>

            {!showNewCliente ? (
              <>
                <SearchableSelect
                  value={selectedCliente ? String(selectedCliente.id) : ""}
                  onChange={(val) =>
                    setSelectedCliente(
                      clientes.find((c) => String(c.id) === val) ?? null,
                    )
                  }
                  options={clienteOptions}
                  placeholder={
                    loadingClientes ? "Cargando clientes..." : "Buscar cliente..."
                  }
                  disabled={loadingClientes}
                />
                {selectedCliente && (
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
                    <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                      {selectedCliente.nombre} {selectedCliente.apellido}
                    </p>
                    <p className="text-xs text-primary-700 dark:text-primary-300">
                      {selectedCliente.telefono}
                      {selectedCliente.email ? ` · ${selectedCliente.email}` : ""}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowNewCliente(true)}
                  className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <UserPlus className="w-4 h-4" />
                  Crear nuevo cliente
                </button>
              </>
            ) : (
              /* ─ Formulario nuevo cliente ─ */
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Nuevo Cliente
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewCliente(false)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL_CLASS}>Nombre *</label>
                    <input
                      value={clienteForm.nombre}
                      onChange={(e) =>
                        setClienteForm((p) => ({
                          ...p,
                          nombre: e.target.value,
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Apellido *</label>
                    <input
                      value={clienteForm.apellido}
                      onChange={(e) =>
                        setClienteForm((p) => ({
                          ...p,
                          apellido: e.target.value,
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Teléfono *</label>
                    <input
                      value={clienteForm.telefono}
                      onChange={(e) =>
                        setClienteForm((p) => ({
                          ...p,
                          telefono: e.target.value,
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Email</label>
                    <input
                      type="email"
                      value={clienteForm.email}
                      onChange={(e) =>
                        setClienteForm((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>DNI / RUT</label>
                    <input
                      value={clienteForm.dni}
                      onChange={(e) =>
                        setClienteForm((p) => ({ ...p, dni: e.target.value }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Dirección</label>
                    <input
                      value={clienteForm.direccion}
                      onChange={(e) =>
                        setClienteForm((p) => ({
                          ...p,
                          direccion: e.target.value,
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleGuardarCliente}
                    disabled={savingCliente}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-60 transition-colors"
                  >
                    {savingCliente ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Guardar cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCliente(false)}
                    className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ PASO 2: VEHÍCULO ═══════════════ */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm text-neutral-700 dark:text-neutral-300">
              Cliente:{" "}
              <span className="font-medium">
                {selectedCliente?.nombre} {selectedCliente?.apellido}
              </span>
            </div>

            <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-primary-500" />
              Seleccionar Vehículo
            </h3>

            {!showNewVehiculo ? (
              <>
                {loadingVehiculos ? (
                  <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando
                    vehículos...
                  </div>
                ) : vehiculos.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600">
                    <Car className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                      Este cliente no tiene vehículos registrados
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowNewVehiculo(true)}
                      className="flex items-center gap-1 mx-auto px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Agregar vehículo
                    </button>
                  </div>
                ) : (
                  <>
                    <SearchableSelect
                      value={
                        selectedVehiculo ? String(selectedVehiculo.id) : ""
                      }
                      onChange={(val) =>
                        setSelectedVehiculo(
                          vehiculos.find((v) => String(v.id) === val) ?? null,
                        )
                      }
                      options={vehiculoOptions}
                      placeholder="Buscar vehículo..."
                    />
                    {selectedVehiculo && (
                      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
                        <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                          {selectedVehiculo.patente}
                        </p>
                        <p className="text-xs text-primary-700 dark:text-primary-300">
                          {selectedVehiculo.marca} {selectedVehiculo.modelo}{" "}
                          {selectedVehiculo.anio}
                          {selectedVehiculo.color
                            ? ` · ${selectedVehiculo.color}`
                            : ""}
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowNewVehiculo(true)}
                      className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Agregar otro vehículo
                    </button>
                  </>
                )}
              </>
            ) : (
              /* ─ Formulario nuevo vehículo ─ */
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Nuevo Vehículo
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewVehiculo(false)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL_CLASS}>Marca *</label>
                    <SearchableSelect
                      value={vehiculoForm.marca}
                      onChange={(val) =>
                        setVehiculoForm((p) => ({
                          ...p,
                          marca: val,
                          modelo: "",
                        }))
                      }
                      options={marcas}
                      placeholder={
                        loadingMarcas ? "Cargando..." : "Buscar marca..."
                      }
                      disabled={loadingMarcas}
                      creatable
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Modelo *</label>
                    <SearchableSelect
                      value={vehiculoForm.modelo}
                      onChange={(val) =>
                        setVehiculoForm((p) => ({ ...p, modelo: val }))
                      }
                      options={modelos}
                      placeholder={
                        loadingModelos
                          ? "Cargando..."
                          : vehiculoForm.marca
                            ? "Buscar modelo..."
                            : "Selecciona marca primero"
                      }
                      disabled={!vehiculoForm.marca || loadingModelos}
                      creatable
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Año *</label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={vehiculoForm.anio}
                      onChange={(e) =>
                        setVehiculoForm((p) => ({
                          ...p,
                          anio: e.target.value,
                        }))
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Patente *</label>
                    <input
                      value={vehiculoForm.patente}
                      onChange={(e) =>
                        setVehiculoForm((p) => ({
                          ...p,
                          patente: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="ABC-123"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS}>Color</label>
                    <ColorSelect
                      value={vehiculoForm.color}
                      onChange={(val) =>
                        setVehiculoForm((p) => ({ ...p, color: val }))
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleGuardarVehiculo}
                    disabled={savingVehiculo}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-60 transition-colors"
                  >
                    {savingVehiculo ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Guardar vehículo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewVehiculo(false)}
                    className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ PASO 3: SERVICIO ═══════════════ */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 flex flex-wrap gap-x-3 gap-y-1">
              <span>
                Cliente:{" "}
                <span className="font-medium">
                  {selectedCliente?.nombre} {selectedCliente?.apellido}
                </span>
              </span>
              <span className="text-neutral-400">·</span>
              <span>
                Vehículo:{" "}
                <span className="font-medium">
                  {selectedVehiculo?.patente} —{" "}
                  {selectedVehiculo?.marca} {selectedVehiculo?.modelo}
                </span>
              </span>
            </div>

            <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary-500" />
              Detalles del Servicio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>
                  Fecha de entrega estimada *
                </label>
                <input
                  type="date"
                  value={servicioForm.fechaEntrega}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setServicioForm((p) => ({
                      ...p,
                      fechaEntrega: e.target.value,
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Estado</label>
                <select
                  value={servicioForm.estado}
                  onChange={(e) =>
                    setServicioForm((p) => ({ ...p, estado: e.target.value }))
                  }
                  className={INPUT_CLASS}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROGRESO">En Progreso</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>Técnico asignado *</label>
              <SearchableSelect
                value={servicioForm.mecanicoId}
                onChange={(val) =>
                  setServicioForm((p) => ({ ...p, mecanicoId: val }))
                }
                options={usuarioOptions}
                placeholder={
                  loadingUsuarios
                    ? "Cargando técnicos..."
                    : "Seleccionar técnico..."
                }
                disabled={loadingUsuarios}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Descripción general</label>
              <textarea
                rows={2}
                value={servicioForm.descripcion}
                onChange={(e) =>
                  setServicioForm((p) => ({
                    ...p,
                    descripcion: e.target.value,
                  }))
                }
                placeholder="Descripción general del trabajo (opcional)..."
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {/* Líneas de servicio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Servicios / Repuestos
                </label>
                <button
                  type="button"
                  onClick={handleAddLinea}
                  className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Agregar
                </button>
              </div>
              <div className="space-y-2">
                {lineas.map((l) => (
                  <div key={l.tempId} className="flex gap-2 items-center">
                    <input
                      value={l.descripcion}
                      onChange={(e) =>
                        handleLineaChange(l.tempId, "descripcion", e.target.value)
                      }
                      placeholder="Descripción del servicio"
                      className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      value={l.precio}
                      onChange={(e) =>
                        handleLineaChange(l.tempId, "precio", e.target.value)
                      }
                      placeholder="Precio"
                      className="w-28 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    {lineas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLinea(l.tempId)}
                        className="text-error-500 hover:text-error-600 dark:hover:text-error-400 p-1 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
                Total: ${totalCalc.toLocaleString("es-AR")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Navegación de pasos ── */}
      <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
        <button
          type="button"
          onClick={step === 1 ? onClose : () => setStep((s) => (s - 1) as Step)}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? "Cancelar" : "Anterior"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            disabled={step === 1 ? !selectedCliente : !selectedVehiculo}
            onClick={() => setStep((s) => (s + 1) as Step)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Crear Orden
          </button>
        )}
      </div>
    </div>
  );
}
