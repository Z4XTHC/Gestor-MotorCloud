import { useState, useEffect } from "react";
import { Edit, Plus, Info } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Cliente } from "../../types";
import clienteApi from "../../api/clienteApi";
import rubroApi from "../../api/rubroApi";
import categoriaAfipApi from "../../api/categoriaAfipApi";
import paisApi from "../../api/paisApi";
import { Rubro } from "../../types/rubro";
import { CategoriaAfip } from "../../types/categoriaAfip";
import Swal from "sweetalert2";
import { Select } from "../../components/common/Select";

interface ClientesFormProps {
  cliente?: Cliente | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClientesForm = ({
  cliente,
  onClose,
  onSuccess,
}: ClientesFormProps) => {
  const isEditing = !!cliente;
  const [loading, setLoading] = useState(false);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [categoriasAfip, setCategoriasAfip] = useState<CategoriaAfip[]>([]);
  const [paises, setPaises] = useState<any[]>([]);
  const [paisLocked, setPaisLocked] = useState(false);
  const [paisLockReason, setPaisLockReason] = useState("");
  const [cuitError, setCuitError] = useState("");
  const [paisSetByTax, setPaisSetByTax] = useState(false);

  const [formData, setFormData] = useState({
    nombreFantasia: "",
    razonSocial: "",
    cuit: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    rubro_id: "",
    categoriaAfip_id: "",
    pais_id: "",
    active: false,
    status: "Sin activar",
  });

  useEffect(() => {
    fetchRubros();
    fetchCategoriasAfip();
    fetchPaises();

    if (isEditing && cliente) {
      setFormData({
        nombreFantasia: cliente.nombreFantasia || "",
        razonSocial: cliente.razonSocial || "",
        cuit: cliente.cuit || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        ciudad: cliente.ciudad || "",
        provincia: cliente.provincia || "",
        rubro_id: cliente.rubro?._id || (cliente as any).rubro_id || "",
        categoriaAfip_id:
          cliente.categoriaAfip?._id || (cliente as any).categoriaAfip_id || "",
        pais_id: cliente.pais?._id || (cliente as any).pais_id || "",
        active: cliente.active ?? false,
        status: cliente.status || "Sin activar",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente]);

  const fetchRubros = async () => {
    try {
      const data = await rubroApi.obtenerRubros();
      setRubros(data);
    } catch (error) {
      console.error("Error loading rubros:", error);
    }
  };

  const fetchCategoriasAfip = async () => {
    try {
      const data = await categoriaAfipApi.obtenerCategoriasAfip();
      setCategoriasAfip(data);
    } catch (error) {
      console.error("Error loading categorias AFIP:", error);
    }
  };

  const fetchPaises = async () => {
    try {
      const data = await paisApi.obtenerPaises();
      setPaises(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error loading paises:", error);
    }
  };

  // Helpers: normalizar y validar CUIT/CUIL (mod11) y formato básico de RUC (PY)
  const normalizeTax = (v?: string) => (v || "").toString().replace(/\D/g, "");

  const validarCUIT = (cuitRaw: string) => {
    const cuit = normalizeTax(cuitRaw);
    if (cuit.length !== 11) return false;
    const nums = cuit.split("").map((d) => parseInt(d, 10));
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) sum += nums[i] * weights[i];
    let dv = 11 - (sum % 11);
    if (dv === 11) dv = 0;
    if (dv === 10) dv = 9;
    return dv === nums[10];
  };

  const looksLikeRucPy = (rucRaw: string) => {
    const r = normalizeTax(rucRaw);
    return r.length >= 6 && r.length <= 10;
  };

  const determineCountryFromTax = (taxRaw?: string) => {
    const tax = normalizeTax(taxRaw);
    if (!tax) {
      setPaisLocked(false);
      setPaisLockReason("");
      setCuitError("");
      if (paisSetByTax) {
        setFormData((s) => ({ ...s, pais_id: "" }));
        setPaisSetByTax(false);
      }
      return;
    }
    // Argentina CUIT
    if (tax.length === 11 && validarCUIT(tax)) {
      const arg = paises.find((p) =>
        (p.nombre || "").toString().toLowerCase().includes("argentina"),
      );
      if (arg) {
        setFormData((s) => ({ ...s, pais_id: arg._id || arg.id }));
        setPaisLocked(true);
        setPaisLockReason("País fijado desde CUIT/CUIL");
        setCuitError("");
        setPaisSetByTax(true);
      }
      return;
    }
    // Paraguay RUC
    if (looksLikeRucPy(tax)) {
      const py = paises.find((p) =>
        (p.nombre || "").toString().toLowerCase().includes("paraguay"),
      );
      if (py) {
        setFormData((s) => ({ ...s, pais_id: py._id || py.id }));
        setPaisLocked(true);
        setPaisLockReason("País fijado desde RUC");
        setCuitError("");
        setPaisSetByTax(true);
      }
      return;
    }
    // No coincide con AR/PY
    setPaisLocked(false);
    setPaisLockReason("");
    setCuitError("");
    setPaisSetByTax(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // El payload debe coincidir con los campos que espera el backend
      const submitData = {
        nombreFantasia: formData.nombreFantasia,
        razonSocial: formData.razonSocial,
        cuit: formData.cuit,
        email: formData.email,
        telefono: formData.telefono,
        pais_id: formData.pais_id,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        rubro_id: formData.rubro_id,
        categoriaAfip_id: formData.categoriaAfip_id,
        active: formData.active,
        status: formData.status,
      };

      if (isEditing && cliente) {
        await clienteApi.actualizarCliente(
          cliente._id || cliente.id || "",
          submitData,
        );
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Cliente actualizado exitosamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await clienteApi.crearCliente(submitData);
        Swal.fire({
          icon: "success",
          title: "Creado",
          text: "Cliente creado exitosamente",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo ${isEditing ? "actualizar" : "crear"} el cliente`,
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-neutral-light dark:border-dark-bg p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={loading}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nombre Fantasía *
              </label>
              <input
                type="text"
                value={formData.nombreFantasia}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombreFantasia: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Razón Social *
              </label>
              <input
                type="text"
                value={formData.razonSocial}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    razonSocial: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <span className="mr-2">CUIT/CUIL - RUC</span>
                <div tabIndex={0} className="relative inline-block group">
                  <Info className="w-4 h-4 text-red-600 cursor-default" />
                  <div
                    role="tooltip"
                    className="absolute left-1/2 bottom-full mb-2 w-64 p-2 text-xs text-white bg-red-600 rounded shadow-md transform -translate-x-1/2 -translate-y-2 hidden group-hover:block group-focus:block z-10"
                  >
                    Para Argentina: ingrese CUIT/CUIL (11 dígitos, sin guiones).
                    Para Paraguay: ingrese RUC (solo dígitos).
                  </div>
                </div>
              </label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, cuit: val });
                  // if cleared and country was set by tax, clear it
                  const normalized = normalizeTax(val);
                  if (!normalized && paisSetByTax) {
                    setFormData((s) => ({ ...s, pais_id: "" }));
                    setPaisLocked(false);
                    setPaisLockReason("");
                    setPaisSetByTax(false);
                  }
                }}
                onBlur={(e) => {
                  const v = e.target.value;
                  const normalized = normalizeTax(v);
                  if (!normalized) {
                    setCuitError("");
                    determineCountryFromTax("");
                    return;
                  }
                  if (normalized.length === 11) {
                    if (!validarCUIT(normalized)) {
                      setCuitError("CUIT inválido");
                    } else {
                      setCuitError("");
                    }
                  } else if (
                    normalized.length >= 6 &&
                    normalized.length <= 10
                  ) {
                    setCuitError("");
                  } else {
                    setCuitError("Formato inválido");
                  }
                  determineCountryFromTax(v);
                }}
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                disabled={loading}
              />
              {cuitError && (
                <p className="mt-1 text-sm text-coral">{cuitError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Teléfono *
              </label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    telefono: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Rubro *
              </label>
              <Select
                value={formData.rubro_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rubro_id: e.target.value,
                  })
                }
                required
                disabled={loading}
                className="border-neutral-light dark:border-dark-bg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:border-transparent focus:ring-primary"
              >
                <option value="">Seleccione un rubro</option>
                {rubros.map((rubro) => (
                  <option key={rubro._id} value={rubro._id}>
                    {rubro.nombre}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Categoría ARCA/DNIT *
              </label>
              <Select
                value={formData.categoriaAfip_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoriaAfip_id: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                required
                disabled={loading}
              >
                <option value="">Seleccione una categoría</option>
                {categoriasAfip.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                País
              </label>
              <Select
                value={formData.pais_id}
                onChange={(e) =>
                  setFormData({ ...formData, pais_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                disabled={loading || paisLocked}
              >
                <option value="">Seleccione un país</option>
                {(paisLocked
                  ? paises.filter((p) => {
                      const name = (p.nombre || "").toString().toLowerCase();
                      return (
                        name.includes("argentina") || name.includes("paraguay")
                      );
                    })
                  : paises
                ).map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Select>
              {paisLocked && paisLockReason && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {paisLockReason}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    direccion: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ciudad: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Provincia
              </label>
              <input
                type="text"
                value={formData.provincia}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    provincia: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-light dark:border-dark-bg">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              icon={
                isEditing ? (
                  <Edit className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )
              }
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Guardar Cambios"
                  : "Crear Cliente"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
