import { useState, useEffect, useRef } from "react";
import {
  Car,
  Tag,
  Palette,
  Hash,
  Calendar,
  User,
  Edit,
  PlusCircle,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import { ColorSelect } from "../../components/common/ColorSelect";
import { COLORES_VEHICULO } from "../../components/common/coloresVehiculo";
import { showError } from "../../components/common/SweetAlert";
import { Vehiculo } from "../../types/vehiculo";
import { Cliente } from "../../types/cliente";
import { crearVehiculo, actualizarVehiculo } from "../../api/vehiculoApi";
import { obtenerClientes } from "../../api/clienteApi";
import {
  obtenerTodasLasMarcas,
  obtenerModelosPorMarca,
} from "../../api/NHTSAapi";

interface VehiculosFormProps {
  vehiculo?: Vehiculo | null;
  /** Cliente preseleccionado (cuando se abre desde el flujo de creación de cliente) */
  clientePreseleccionado?: Cliente | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const VehiculosForm = ({
  vehiculo,
  clientePreseleccionado,
  onClose,
  onSuccess,
}: VehiculosFormProps) => {
  const isEditing = !!vehiculo;
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  // ── NHTSA: marcas ──────────────────────────────────────────────────────────
  const [marcaOptions, setMarcaOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  // ── NHTSA: modelos ─────────────────────────────────────────────────────────
  const [modeloOptions, setModeloOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingModelos, setLoadingModelos] = useState(false);

  /** Ref para saber si el cambio de marca fue por el usuario (no carga inicial) */
  const prevMarcaRef = useRef<string>("");

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    anio: new Date().getFullYear().toString(),
    color: "",
    patente: "",
    clienteId: "",
    status: true,
  });

  // ── Cargar todas las marcas al montar ──────────────────────────────────────
  useEffect(() => {
    const fetchMarcas = async () => {
      setLoadingMarcas(true);
      try {
        const makes = await obtenerTodasLasMarcas();
        const opts = makes
          .map((m) => ({ value: m.Make_Name, label: m.Make_Name }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setMarcaOptions(opts);
      } catch {
        // silencioso; el usuario puede tipear la marca manualmente si NHTSA falla
      } finally {
        setLoadingMarcas(false);
      }
    };
    fetchMarcas();
  }, []);

  // ── Cargar modelos cada vez que cambie la marca ────────────────────────────
  useEffect(() => {
    if (!formData.marca) {
      setModeloOptions([]);
      prevMarcaRef.current = "";
      return;
    }

    // Si la marca la cambió el usuario (no la carga inicial al editar), limpiar modelo
    if (prevMarcaRef.current && prevMarcaRef.current !== formData.marca) {
      setFormData((prev) => ({ ...prev, modelo: "" }));
    }
    prevMarcaRef.current = formData.marca;

    const fetchModelos = async () => {
      setLoadingModelos(true);
      try {
        const models = await obtenerModelosPorMarca(formData.marca);
        const opts = models
          .map((m) => ({ value: m.Model_Name, label: m.Model_Name }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setModeloOptions(opts);
      } catch {
        setModeloOptions([]);
      } finally {
        setLoadingModelos(false);
      }
    };
    fetchModelos();
  }, [formData.marca]);

  // ── Cargar lista de clientes para el selector ─────────────────────────────
  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const data = await obtenerClientes();
        setClientes(data.filter((c) => c.status !== false));
      } catch {
        showError("Error", "No se pudo cargar la lista de clientes.");
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  // Precarga al editar o preseleccionar cliente
  useEffect(() => {
    if (isEditing && vehiculo) {
      setFormData({
        marca: vehiculo.marca || "",
        modelo: vehiculo.modelo || "",
        anio: String(vehiculo.anio) || String(new Date().getFullYear()),
        color: vehiculo.color || "",
        patente: vehiculo.patente || "",
        clienteId: vehiculo.cliente?.id
          ? String(vehiculo.cliente.id)
          : vehiculo.clienteId
            ? String(vehiculo.clienteId)
            : "",
        status: vehiculo.status ?? true,
      });
    } else if (clientePreseleccionado) {
      setFormData((prev) => ({
        ...prev,
        clienteId: String(clientePreseleccionado.id),
      }));
    }
  }, [vehiculo, isEditing, clientePreseleccionado]);

  const set = (field: keyof typeof formData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteId) {
      showError(
        "Cliente requerido",
        "Debes seleccionar el cliente propietario del vehículo.",
      );
      return;
    }
    setLoading(true);
    try {
      const payload = {
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        anio: Number(formData.anio),
        color: formData.color.trim(),
        patente: formData.patente.trim().toUpperCase(),
        // Spring Boot espera objeto anidado para la FK
        cliente: { id: Number(formData.clienteId) },
        status: formData.status,
      };

      if (isEditing && vehiculo) {
        await actualizarVehiculo(String(vehiculo.id), payload);
      } else {
        await crearVehiculo(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al guardar vehículo:", err);
      showError(
        "Error",
        `No se pudo ${isEditing ? "actualizar" : "registrar"} el vehículo. Verifica los datos e intenta nuevamente.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const anioOptions = Array.from({ length: 40 }, (_, i) => {
    const y = String(currentYear - i);
    return { value: y, label: y };
  });

  const estadoOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  const clienteOptions = clientes.map((c) => ({
    value: String(c.id),
    label: `${c.nombre} ${c.apellido} — ${c.dni}`,
  }));

  const isClienteLocked = !isEditing && !!clientePreseleccionado;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* === AVISO: cliente preseleccionado === */}
        {clientePreseleccionado && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <Info className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
            <p className="text-sm text-primary-700 dark:text-primary-300">
              Registrando vehículo para{" "}
              <span className="font-semibold">
                {clientePreseleccionado.nombre}{" "}
                {clientePreseleccionado.apellido}
              </span>
            </p>
          </div>
        )}

        {/* === SECCIÓN: Propietario === */}
        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Propietario
          </h4>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Cliente <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={clienteOptions}
              value={formData.clienteId}
              onChange={(val) => set("clienteId", val)}
              placeholder={
                loadingClientes
                  ? "Cargando clientes..."
                  : "Buscar cliente por nombre o DNI..."
              }
              disabled={loading || loadingClientes || isClienteLocked}
            />
            {isClienteLocked && (
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                <Info className="w-3 h-3 inline" /> Cliente asignado
                automáticamente
              </p>
            )}
          </div>
        </section>

        {/* === SECCIÓN: Datos del Vehículo === */}
        <section>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Car className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Datos del Vehículo
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Marca <span className="text-red-500">*</span>
                  {loadingMarcas && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary ml-1" />
                  )}
                </span>
              </label>
              <SearchableSelect
                options={marcaOptions}
                value={formData.marca}
                onChange={(val) => set("marca", val)}
                placeholder={
                  loadingMarcas
                    ? "Cargando marcas..."
                    : "Buscar marca (Toyota, Ford...)"
                }
                disabled={loading || loadingMarcas}
                required
                creatable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  Modelo <span className="text-red-500">*</span>
                  {loadingModelos && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary ml-1" />
                  )}
                </span>
              </label>
              <SearchableSelect
                options={modeloOptions}
                value={formData.modelo}
                onChange={(val) => set("modelo", val)}
                placeholder={
                  !formData.marca
                    ? "Selecciona primero la marca"
                    : loadingModelos
                      ? "Cargando modelos..."
                      : "Buscar modelo..."
                }
                disabled={loading || !formData.marca || loadingModelos}
                required
                creatable
              />
              {!formData.marca && (
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                  Selecciona una marca para ver sus modelos
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Año <span className="text-red-500">*</span>
                </span>
              </label>
              <SearchableSelect
                options={anioOptions}
                value={formData.anio}
                onChange={(val) => set("anio", val)}
                placeholder="Seleccione el año..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" />
                  Color
                </span>
              </label>
              <ColorSelect
                options={COLORES_VEHICULO}
                value={formData.color}
                onChange={(val) => set("color", val)}
                placeholder="Seleccionar color..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  Patente <span className="text-red-500">*</span>
                </span>
              </label>
              <Input
                type="text"
                value={formData.patente}
                onChange={(e) => set("patente", e.target.value.toUpperCase())}
                placeholder="Ej: ABC-123"
                required
                disabled={loading}
                maxLength={8}
              />
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                Se guardará en mayúsculas automáticamente
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={estadoOptions}
                value={String(formData.status)}
                onChange={(val) => set("status", val === "true")}
                placeholder="Seleccione un estado"
                disabled={loading}
              />
            </div>
          </div>
        </section>
      </div>

      {/* === FOOTER === */}
      <div className="flex gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          icon={
            isEditing ? (
              <Edit className="w-4 h-4" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )
          }
          loading={loading}
          className="flex-1 bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          {isEditing ? "Guardar Cambios" : "Registrar Vehículo"}
        </Button>
      </div>
    </form>
  );
};
