import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  UserPlus,
  Mail,
  Image,
  Phone,
  Hash,
  Info,
  Globe,
  FileText,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { SearchableSelect } from "../../components/common/SearchableSelect";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/api";
import paisApi from "../../api/paisApi";
import Swal from "sweetalert2";

interface RegisterFormData {
  razonSocial: string;
  cuit: string;
  telefono: string;
  email: string;
  rubro: string;
  categoria: string;
  pais: string;
  logo?: FileList;
}

export const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rubros, setRubros] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]);
  const [paisLocked, setPaisLocked] = useState(false);
  const [paisLockReason, setPaisLockReason] = useState("");
  const RECAPTCHA_SITE_KEY =
    (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<RegisterFormData>({
    mode: "onChange",
  });

  useEffect(() => {
    // Cargar opciones para selects
    const loadOptions = async () => {
      try {
        const [rRes, cRes] = await Promise.all([
          axiosInstance.get(API_ENDPOINTS.RUBROS.LIST, {
            headers: { "x-skip-auth-redirect": "true" },
          }),
          axiosInstance.get(API_ENDPOINTS.CATEGORIAS_AFIP.LIST, {
            headers: { "x-skip-auth-redirect": "true" },
          }),
        ]);
        const pRes = await paisApi.obtenerPaises();
        setRubros(Array.isArray(rRes.data) ? rRes.data : rRes.data.data || []);
        setCategorias(
          Array.isArray(cRes.data) ? cRes.data : cRes.data.data || [],
        );
        setPaises(Array.isArray(pRes) ? pRes : pRes.data || []);
      } catch (e) {
        // Ignorar si alguno no existe
      }
    };
    loadOptions();
    // Cargar script reCAPTCHA v3 si está configurado
    if (RECAPTCHA_SITE_KEY) {
      const scriptId = "recaptcha-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

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
    // Validación cliente: solo formato (dígitos) y longitud plausible (6-10)
    return r.length >= 6 && r.length <= 10;
  };

  const determineCountryFromTax = (taxRaw?: string) => {
    const tax = normalizeTax(taxRaw);
    if (!tax) {
      setPaisLocked(false);
      setPaisLockReason("");
      return;
    }
    // Priorizar CUIT/CUIL (Argentina) cuando tiene 11 dígitos y pasa mod11
    if (tax.length === 11 && validarCUIT(tax)) {
      const arg = paises.find((p) =>
        (p.nombre || "").toString().toLowerCase().includes("argentina"),
      );
      if (arg) setValue("pais", arg._id || arg.id);
      setPaisLocked(true);
      setPaisLockReason("País fijado desde CUIT/CUIL");
      return;
    }
    // RUC Paraguay (cliente): formato numérico y longitud plausible
    if (looksLikeRucPy(tax)) {
      const py = paises.find((p) =>
        (p.nombre || "").toString().toLowerCase().includes("paraguay"),
      );
      if (py) setValue("pais", py._id || py.id);
      setPaisLocked(true);
      setPaisLockReason("País fijado desde RUC");
      return;
    }
    // No coincide con AR/PY -> permitir selección manual
    setPaisLocked(false);
    setPaisLockReason("");
  };

  // Register con validación compuesta para el campo CUIT/CUIL/RUC.
  // El campo es opcional; si está vacío, se permite y el usuario puede seleccionar país.
  const cuitRegister = register("cuit", {
    validate: (value: string) => {
      const v = normalizeTax(value);
      if (!v) return true; // vacío -> permitido (selección manual de país)
      // Validar que solo contenga dígitos (prevenir strings alfanuméricos)
      if (!/^\d+$/.test(v)) return "Solo se permiten números";
      // Validar longitud máxima (prevenir spam)
      if (v.length > 15) return "Formato inválido";
      // Si tiene 11 dígitos, validar CUIT argentino (mod11)
      if (v.length === 11) return validarCUIT(v) ? true : "CUIT inválido";
      // Para Paraguay (RUC) permitimos formato numérico entre 6 y 10 dígitos
      if (v.length >= 6 && v.length <= 10) return true;
      return "Formato inválido";
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // Validación adicional anti-spam
      const cuitNormalized = normalizeTax(data.cuit);
      if (cuitNormalized && !/^\d+$/.test(cuitNormalized)) {
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "El CUIT/RUC debe contener solo números",
          confirmButtonColor: "#F39F23",
        });
        setLoading(false);
        return;
      }

      // Validar que razón social no sea sospechosa
      const razonTrimmed = data.razonSocial.trim();
      if (
        razonTrimmed.length < 3 ||
        /[A-Z]{6,}/.test(razonTrimmed) ||
        /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{8,}/.test(razonTrimmed)
      ) {
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Razón social inválida",
          confirmButtonColor: "#F39F23",
        });
        setLoading(false);
        return;
      }

      const form = new FormData();
      // Ejecutar reCAPTCHA v3 y adjuntar token (si está configurado)
      if (RECAPTCHA_SITE_KEY && (window as any).grecaptcha) {
        try {
          await new Promise<void>((resolve) => {
            (window as any).grecaptcha.ready(() => {
              (window as any).grecaptcha
                .execute(RECAPTCHA_SITE_KEY, { action: "register" })
                .then((token: string) => {
                  form.append("recaptchaToken", token);
                  resolve();
                })
                .catch(() => resolve());
            });
          });
        } catch (e) {
          // ignore captcha errors client-side
        }
      }
      form.append("razonSocial", data.razonSocial);
      form.append("cuit", data.cuit);
      form.append("telefono", data.telefono);
      form.append("email", data.email);
      form.append("rubro", data.rubro);
      form.append("categoriaAfip", data.categoria);
      form.append("pais", data.pais);
      if (data.logo && data.logo.length > 0) {
        form.append("image", data.logo[0]);
      }

      await axiosInstance.post(API_ENDPOINTS.CLIENTES.CREATE, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Registrado",
        text: "Registro enviado. Revise su correo para activar la cuenta.",
        confirmButtonColor: "#F39F23",
      }).then(() => navigate("/login"));
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Error al registrar",
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-primary-lg p-8 border border-primary dark:border-dark-bg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white dark:text-dark-bg" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-1">
          Registro
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Complete los datos para crear su cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Razón Social
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register("razonSocial", {
                required: "Requerido",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 150, message: "Máximo 150 caracteres" },
                validate: (value) => {
                  const trimmed = value.trim();
                  if (trimmed.length < 3) return "Mínimo 3 caracteres";
                  // Detectar patrones sospechosos: más de 5 mayúsculas consecutivas o caracteres aleatorios
                  if (/[A-Z]{6,}/.test(trimmed)) return "Formato inválido";
                  // Detectar strings con muchas consonantes seguidas (posible random)
                  if (
                    /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{8,}/.test(
                      trimmed,
                    )
                  )
                    return "Formato inválido";
                  return true;
                },
              })}
              maxLength={150}
              placeholder="Ej: Empresa S.A."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.razonSocial && (
            <p className="mt-1 text-sm text-coral">
              {errors.razonSocial.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <span className="mr-2">CUIT/CUIL - RUC</span>
            <div tabIndex={0} className="relative inline-block group">
              <Info className="w-4 h-4 text-gray-400 dark:text-gray-300 cursor-default" />
              <div
                role="tooltip"
                className="absolute left-1/2 bottom-full mb-2 w-64 p-2 text-xs text-white bg-gray-700 dark:bg-gray-800 rounded shadow-md transform -translate-x-1/2 -translate-y-2 hidden group-hover:block group-focus:block z-10"
              >
                Para Argentina: ingrese CUIT/CUIL (11 dígitos, sin guiones).
                Para Paraguay: ingrese RUC (solo dígitos).
              </div>
            </div>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...cuitRegister}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={15}
              placeholder="Solo números"
              onKeyPress={(e) => {
                // Prevenir caracteres no numéricos en tiempo real
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onBlur={(e) => {
                // conservar comportamiento de react-hook-form
                if ((cuitRegister as any).onBlur)
                  (cuitRegister as any).onBlur(e);
                determineCountryFromTax(e.target.value || getValues("cuit"));
              }}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.cuit && (
            <p className="mt-1 text-sm text-coral">{errors.cuit.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register("telefono", {
                required: "Requerido",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
                pattern: {
                  value: /^[0-9\s\-\+\(\)]+$/,
                  message: "Formato de teléfono inválido",
                },
              })}
              type="tel"
              maxLength={20}
              placeholder="Ej: +54 11 1234-5678"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.telefono && (
            <p className="mt-1 text-sm text-coral">{errors.telefono.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              {...register("email", {
                required: "Requerido",
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email inválido",
                },
                validate: (value) => {
                  const email = value.toLowerCase();
                  // Bloquear dominios sospechosos comunes
                  const suspiciousDomains = [
                    "tempmail",
                    "throwaway",
                    "guerrillamail",
                    "10minutemail",
                  ];
                  if (suspiciousDomains.some((d) => email.includes(d))) {
                    return "Email no permitido";
                  }
                  // Validar formato básico
                  if (!email.includes("@") || !email.includes(".")) {
                    return "Email inválido";
                  }
                  return true;
                },
              })}
              maxLength={100}
              placeholder="email@empresa.com"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-coral">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rubro
            </label>
            <SearchableSelect
              value={getValues("rubro") || ""}
              onChange={(value) =>
                setValue("rubro", value, { shouldValidate: true })
              }
              options={rubros.map((r) => ({
                value: r._id || r.id || "",
                label: r.nombre || r.nombreFantasia || "",
              }))}
              placeholder="Seleccionar"
              required
            />
            {errors.rubro && (
              <p className="mt-1 text-sm text-coral">{errors.rubro.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría ARCA/DNIT
            </label>
            <SearchableSelect
              value={getValues("categoria") || ""}
              onChange={(value) =>
                setValue("categoria", value, { shouldValidate: true })
              }
              options={categorias.map((c) => ({
                value: c._id || c.id || "",
                label: c.nombre || "",
              }))}
              placeholder="Seleccionar"
              required
            />
            {errors.categoria && (
              <p className="mt-1 text-sm text-coral">
                {errors.categoria.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            País
          </label>
          <SearchableSelect
            value={getValues("pais") || ""}
            onChange={(value) =>
              setValue("pais", value, { shouldValidate: true })
            }
            options={(paisLocked
              ? paises.filter((p) => {
                  const name = (p.nombre || "").toString().toLowerCase();
                  return (
                    name.includes("argentina") || name.includes("paraguay")
                  );
                })
              : paises
            ).map((p) => ({
              value: p._id || p.id || "",
              label: p.nombre || "",
            }))}
            placeholder="Seleccionar"
            required
            disabled={paisLocked}
          />
          {paisLocked && paisLockReason && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {paisLockReason}
            </p>
          )}
          {errors.pais && (
            <p className="mt-1 text-sm text-coral">{errors.pais.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logo
          </label>
          <div className="relative">
            <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              {...register("logo")}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-bg border border-neutral-light dark:border-dark-bg rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Al registrarse, recibirá un correo para activar su cuenta.
          </p>
          <Link
            to="/login"
            className="text-sm text-primary dark:text-dark-primary hover:underline"
          >
            Volver
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Registrarse
        </Button>
      </form>
    </div>
  );
};
