import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  FileText,
  AlertCircle,
  CheckCircle,
  Calendar,
  Users,
  Building2,
  Zap,
  Eye,
  ClipboardList,
  UserCog,
  MapPin,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Loading } from "../components/common/Loading";
import axiosInstance from "../api/axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { useAuth } from "../contexts/AuthContext";

// Constantes para caché
const CACHE_KEYS = {
  ESTADISTICAS: "dashboard_estadisticas",
  ACTIVIDADES: "dashboard_actividades",
  NOVEDADES: "dashboard_novedades",
  NOTIFICACIONES: "dashboard_notificaciones",
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Utilidades de caché
const getCachedData = (key: string) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    return isExpired ? null : data;
  } catch {
    return null;
  }
};

const setCachedData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignorar errores de localStorage (puede estar lleno o deshabilitado)
  }
};

interface NotificacionDisplay {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo?: "info" | "warning" | "error" | "success";
}

interface Novedad {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: "info" | "warning" | "success";
}

interface ActividadReciente {
  id: string;
  usuario: string;
  accion: string;
  descripcion: string;
  fecha: string;
  tipo: "registro" | "proyecto" | "orden" | "documento" | "otro";
  enlace?: string; // Ruta para navegar al detalle
  entityId?: string; // ID de la entidad relacionada
}

interface AccesoRapido {
  ruta: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  color: string;
}

interface Estadistica {
  valor: number | string;
  label: string;
  icono: React.ReactNode;
  color: string;
}

// Versión serializable para localStorage (sin JSX)
interface EstadisticaSerializable {
  valor: number | string;
  label: string;
  iconType: string; // 'building2' | 'userCog' | 'clipboardList' | 'zap' | 'fileText'
  color: string;
}

interface AccesoRapidoSerializable {
  ruta: string;
  titulo: string;
  descripcion: string;
  iconType: string;
  color: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [nombreEmpresa, setNombreEmpresa] = useState<string>("EMPRESA");
  const [notificaciones, setNotificaciones] = useState<NotificacionDisplay[]>(
    [],
  );
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [actividadesRecientes, setActividadesRecientes] = useState<
    ActividadReciente[]
  >([]);
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper para obtener icono por tipo
  const getIconByType = (iconType: string, className: string = "w-5 h-5") => {
    switch (iconType) {
      case "building2":
        return <Building2 className={className} />;
      case "usercog":
        return <UserCog className={className} />;
      case "clipboardlist":
        return <ClipboardList className={className} />;
      case "zap":
        return <Zap className={className} />;
      case "filetext":
        return <FileText className={className} />;
      case "bell":
        return <Bell className={className} />;
      case "users":
        return <Users className={className} />;
      case "mappin":
        return <MapPin className={className} />;
      case "checkcircle":
        return <CheckCircle className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  // Determinar rol del usuario
  const getUserRole = (): "admin" | "user" | "guest" => {
    if (!user) return "guest";
    if (user.rol === "ADMIN" || user.admin === true) return "admin";
    return "user";
  };

  const userRole = getUserRole();

  // Cargar datos cacheados inmediatamente para render optimista
  useEffect(() => {
    const cachedStats = getCachedData(
      `${CACHE_KEYS.ESTADISTICAS}_${userRole}`,
    ) as EstadisticaSerializable[] | null;
    const cachedActividades = getCachedData(
      `${CACHE_KEYS.ACTIVIDADES}_${userRole}`,
    );
    const cachedNovedades = getCachedData(
      `${CACHE_KEYS.NOVEDADES}_${userRole}`,
    );
    const cachedNotifs = getCachedData(
      `${CACHE_KEYS.NOTIFICACIONES}_${user?.cliente_id}`,
    );

    // Convertir estadísticas serializables a componentes con iconos
    if (cachedStats) {
      const statsWithIcons: Estadistica[] = cachedStats.map((stat) => ({
        ...stat,
        icono: getIconByType(stat.iconType),
      }));
      setEstadisticas(statsWithIcons);
    }

    if (cachedActividades) setActividadesRecientes(cachedActividades);
    if (cachedNovedades) setNovedades(cachedNovedades);
    if (cachedNotifs) setNotificaciones(cachedNotifs);

    // Si hay datos en caché, mostrar inmediatamente y reducir loading
    if (cachedStats || cachedActividades || cachedNovedades) {
      setLoading(false);
    }
  }, [userRole, user?.cliente_id]);

  // Función para cargar estadísticas según rol con caché
  const fetchEstadisticas = useCallback(async () => {
    try {
      const stats: Estadistica[] = [];

      if (userRole === "admin") {
        // Estadísticas para Admin - Llamadas en paralelo
        const [usuariosRes, ordenesRes] = await Promise.allSettled([
          axiosInstance.get(API_ENDPOINTS.USERS.LIST),
          axiosInstance.get(API_ENDPOINTS.ORDENES.LIST),
        ]);

        if (usuariosRes.status === "fulfilled") {
          const usuarios = Array.isArray(usuariosRes.value.data)
            ? usuariosRes.value.data
            : usuariosRes.value.data.data || [];
          stats.push({
            valor: usuarios.length,
            label: "Usuarios Registrados",
            icono: <Users className="w-5 h-5" />,
            color: "text-primary",
          });
        }

        if (ordenesRes.status === "fulfilled") {
          const ordenes = Array.isArray(ordenesRes.value.data)
            ? ordenesRes.value.data
            : ordenesRes.value.data.data || [];
          const ordenesActivas = ordenes.filter(
            (o: any) => o.estado !== "finalizada",
          );
          stats.push({
            valor: ordenesActivas.length,
            label: "Órdenes Activas",
            icono: <ClipboardList className="w-5 h-5" />,
            color: "text-coral",
          });
        }
      } else if (userRole === "tecnico") {
        // Estadísticas para Técnico - Llamadas en paralelo
        const [ordenesRes, auditoriasRes] = await Promise.allSettled([
          axiosInstance.get(API_ENDPOINTS.ORDENES.LIST),
          axiosInstance.get(API_ENDPOINTS.AUDITORIA_FLASH.LIST),
        ]);

        if (ordenesRes.status === "fulfilled") {
          const ordenes = Array.isArray(ordenesRes.value.data)
            ? ordenesRes.value.data
            : ordenesRes.value.data.data || [];
          const misOrdenes = ordenes.filter(
            (o: any) => o.tecnico_id === user?.tecnico_id,
          );
          stats.push({
            valor: misOrdenes.length,
            label: "Órdenes Asignadas",
            icono: <ClipboardList className="w-5 h-5" />,
            color: "text-primary",
          });
        }

        if (auditoriasRes.status === "fulfilled") {
          const auditorias = Array.isArray(auditoriasRes.value.data)
            ? auditoriasRes.value.data
            : auditoriasRes.value.data.data || [];
          const auditoriasPendientes = auditorias.filter(
            (a: any) => a.etapaActual !== "finalizada",
          );
          stats.push({
            valor: auditoriasPendientes.length,
            label: "Proyectos en Curso",
            icono: <Zap className="w-5 h-5" />,
            color: "text-accent",
          });
        }
      } else if (userRole === "cliente") {
        // Estadísticas para Cliente - Llamadas en paralelo
        const [empleadosRes, ordenesRes, auditoriasRes] =
          await Promise.allSettled([
            axiosInstance.get(API_ENDPOINTS.EMPLEADOS.LIST),
            axiosInstance.get(API_ENDPOINTS.ORDENES.LIST),
            axiosInstance.get(API_ENDPOINTS.AUDITORIA_FLASH.LIST),
          ]);

        if (empleadosRes.status === "fulfilled") {
          const empleados = Array.isArray(empleadosRes.value.data)
            ? empleadosRes.value.data
            : empleadosRes.value.data.data || [];
          const misEmpleados = empleados.filter(
            (e: any) => e.cliente_id === user?.cliente_id,
          );
          stats.push({
            valor: misEmpleados.length,
            label: "Empleados Registrados",
            icono: <Users className="w-5 h-5" />,
            color: "text-primary",
          });
        }

        if (ordenesRes.status === "fulfilled") {
          const ordenes = Array.isArray(ordenesRes.value.data)
            ? ordenesRes.value.data
            : ordenesRes.value.data.data || [];
          const ordenesActivas = ordenes.filter(
            (o: any) => o.estado !== "finalizada",
          );
          stats.push({
            valor: ordenesActivas.length,
            label: "Órdenes Activas",
            icono: <ClipboardList className="w-5 h-5" />,
            color: "text-accent",
          });
        }

        if (auditoriasRes.status === "fulfilled") {
          const auditorias = Array.isArray(auditoriasRes.value.data)
            ? auditoriasRes.value.data
            : auditoriasRes.value.data.data || [];
          stats.push({
            valor: auditorias.length,
            label: "Proyectos Activos",
            icono: <Zap className="w-5 h-5" />,
            color: "text-coral",
          });
        }
      }

      setEstadisticas(stats);

      // Guardar versión serializable en caché (sin JSX)
      const statsSerializable: EstadisticaSerializable[] = stats.map((stat) => {
        // Extraer tipo de icono del componente React
        let iconType = "filetext"; // default
        if (
          stat.icono &&
          typeof stat.icono === "object" &&
          "type" in stat.icono
        ) {
          const iconComponent = stat.icono as any;
          const componentName =
            iconComponent.type?.displayName || iconComponent.type?.name || "";
          iconType = componentName.toLowerCase();
        }
        return {
          valor: stat.valor,
          label: stat.label,
          iconType,
          color: stat.color,
        };
      });
      setCachedData(
        `${CACHE_KEYS.ESTADISTICAS}_${userRole}`,
        statsSerializable,
      );
    } catch (error) {
      console.warn("⚠️ Error al cargar estadísticas:", error);
    }
  }, [userRole, user]);

  // Función para cargar notificaciones (solo clientes) con caché
  const fetchNotificaciones = useCallback(async () => {
    try {
      const notifResponse = await axiosInstance.get(
        API_ENDPOINTS.NOTIFICACIONES.LIST,
      );
      const notificacionesData = Array.isArray(notifResponse.data)
        ? notifResponse.data
        : notifResponse.data.data || [];

      interface NotifBackend {
        _id?: string;
        id?: string;
        textoDescriptivo: string;
        leida: boolean;
        tipo?: string;
        createdAt?: string;
      }

      const notifMapped = notificacionesData
        .slice(0, 3)
        .map((notif: NotifBackend) => ({
          id: notif._id || notif.id || "",
          titulo: notif.tipo ? notif.tipo.toUpperCase() : "Notificación",
          mensaje: notif.textoDescriptivo,
          fecha: notif.createdAt || new Date().toISOString(),
          leida: notif.leida,
          tipo:
            (notif.tipo as "info" | "warning" | "error" | "success") || "info",
        }));
      setNotificaciones(notifMapped);
      setCachedData(
        `${CACHE_KEYS.NOTIFICACIONES}_${user?.cliente_id}`,
        notifMapped,
      );
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number };
        message?: string;
      };
      if (
        axiosError?.response?.status === 404 ||
        axiosError?.response?.status === 403
      ) {
        // Sin acceso a notificaciones
      } else {
        console.warn("⚠️ Error al cargar notificaciones:", axiosError?.message);
      }
      setNotificaciones([]);
    }
  }, [user?.cliente_id]);

  // Función para cargar actividades recientes (admin y técnicos) con caché
  const fetchActividadesRecientes = useCallback(async () => {
    try {
      const actividades: ActividadReciente[] = [];

      // Llamadas en paralelo para mejor rendimiento
      const [auditoriasRes, ordenesRes, clientesRes] = await Promise.allSettled(
        [
          axiosInstance.get(API_ENDPOINTS.AUDITORIA_FLASH.LIST),
          axiosInstance.get(API_ENDPOINTS.ORDENES.LIST),
          axiosInstance.get(API_ENDPOINTS.CLIENTES.LIST),
        ],
      );

      // Crear mapa de clientes para búsqueda rápida
      const clientesMap = new Map();
      if (clientesRes.status === "fulfilled") {
        const clientes = Array.isArray(clientesRes.value.data)
          ? clientesRes.value.data
          : clientesRes.value.data.data || [];
        clientes.forEach((cliente: any) => {
          clientesMap.set(
            cliente._id || cliente.id,
            cliente.nombreFantasia || cliente.razonSocial || "Cliente",
          );
        });
      }

      // Procesar proyectos activos
      if (auditoriasRes.status === "fulfilled") {
        const auditorias = Array.isArray(auditoriasRes.value.data)
          ? auditoriasRes.value.data
          : auditoriasRes.value.data.data || [];

        auditorias.slice(0, 3).forEach((aud: any) => {
          const nombreCliente =
            clientesMap.get(aud.cliente_id) ||
            aud.razonSocial ||
            "Cliente no identificado";
          actividades.push({
            id: `aud-${aud._id || aud.id}`,
            usuario: nombreCliente,
            accion: "inició un nuevo proyecto",
            descripcion: `Estado: ${aud.etapaActual || "iniciada"}`,
            fecha: aud.createdAt || new Date().toISOString(),
            tipo: "proyecto",
            enlace: `/proyectos/${aud._id || aud.id}`,
            entityId: aud._id || aud.id,
          });
        });
      }

      // Procesar órdenes
      if (ordenesRes.status === "fulfilled") {
        const ordenes = Array.isArray(ordenesRes.value.data)
          ? ordenesRes.value.data
          : ordenesRes.value.data.data || [];

        ordenes.slice(0, 2).forEach((orden: any) => {
          const nombreCliente =
            clientesMap.get(orden.cliente_id) ||
            orden.nombreCliente ||
            "Cliente no identificado";
          actividades.push({
            id: `orden-${orden._id || orden.id}`,
            usuario: nombreCliente,
            accion: "creó una nueva orden de trabajo",
            descripcion: `Tipo: ${orden.tipo_orden || "General"}`,
            fecha: orden.createdAt || new Date().toISOString(),
            tipo: "orden",
            enlace: `/ordenes/${orden._id || orden.id}`,
            entityId: orden._id || orden.id,
          });
        });
      }

      // Ordenar por fecha más reciente
      actividades.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );

      const actividadesLimitadas = actividades.slice(0, 5);
      setActividadesRecientes(actividadesLimitadas);
      setCachedData(
        `${CACHE_KEYS.ACTIVIDADES}_${userRole}`,
        actividadesLimitadas,
      );
    } catch (error) {
      console.warn("⚠️ Error al cargar actividades recientes:", error);
    }
  }, [userRole]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Cargando datos de la página de inicio

        // 1. Obtener nombre de empresa desde el cliente_id del usuario
        if (user?.cliente_id) {
          try {
            const clienteResponse = await axiosInstance.get(
              API_ENDPOINTS.CLIENTES.GET(user.cliente_id),
            );
            const nombreFantasia =
              clienteResponse.data.nombreFantasia || "EMPRESA";
            setNombreEmpresa(nombreFantasia);
            // Nombre de empresa cargado
          } catch {
            console.warn("⚠️ No se pudo cargar el nombre de la empresa");
            setNombreEmpresa("EMPRESA");
          }
        } else {
          // Si es admin o técnico sin cliente, mostrar su nombre:
          const nombreUsuario =
            user?.nombre && user?.apellido
              ? `${user.nombre} ${user.apellido}`
              : user?.username || "Panel de Administración";

          setNombreEmpresa(nombreUsuario);
          // Usuario admin sin cliente asociado
        }

        // 2. Cargar estadísticas según rol
        await fetchEstadisticas();

        // 3. Obtener notificaciones o actividades según rol
        if (userRole === "cliente") {
          // Solo clientes ven notificaciones
          await fetchNotificaciones();
        } else if (userRole === "admin") {
          // Admin ve actividades recientes del sistema
          await fetchActividadesRecientes();
        }

        // 4. Obtener novedades desde capacitaciones o auditorías recientes
        try {
          const novedadesTemp: Novedad[] = [];

          // Obtener últimas capacitaciones (solo para admins)
          try {
            if (user?.rol === "ADMIN" || user?.admin) {
              const capacitacionesResponse = await axiosInstance.get(
                API_ENDPOINTS.CAPACITACIONES.LIST,
              );
              const capacitaciones = Array.isArray(capacitacionesResponse.data)
                ? capacitacionesResponse.data
                : capacitacionesResponse.data.data || [];

              if (capacitaciones.length > 0) {
                const ultimaCapacitacion = capacitaciones[0];
                novedadesTemp.push({
                  id: `cap-${ultimaCapacitacion._id || ultimaCapacitacion.id}`,
                  titulo: "Capacitación Programada",
                  descripcion: `${
                    ultimaCapacitacion.titulo || "Nueva capacitación programada"
                  }`,
                  fecha:
                    ultimaCapacitacion.fechaInicio ||
                    ultimaCapacitacion.createdAt,
                  tipo: "info",
                });
              }
            }
          } catch {
            // Silenciar si el endpoint no está disponible (403 para admin)
            // Capacitaciones no disponibles
          }

          // Obtener últimos proyectos (disponible para cliente, técnico o admin)
          try {
            if (user?.cliente_id || user?.tecnico_id || user?.admin) {
              const auditoriasResponse = await axiosInstance.get(
                API_ENDPOINTS.AUDITORIA_FLASH.LIST,
              );
              const auditorias = Array.isArray(auditoriasResponse.data)
                ? auditoriasResponse.data
                : auditoriasResponse.data.data || [];

              if (auditorias.length > 0 && novedadesTemp.length < 2) {
                const ultimaAuditoria = auditorias[0];
                const etapa = ultimaAuditoria.etapaActual || "datos-generales";
                novedadesTemp.push({
                  id: `aud-${ultimaAuditoria._id || ultimaAuditoria.id}`,
                  titulo: "Proyecto en Progreso",
                  descripcion: `Proyecto en etapa: ${etapa.replace(/-/g, " ")}`,
                  fecha:
                    ultimaAuditoria.fechaInicio || ultimaAuditoria.createdAt,
                  tipo: etapa === "finalizada" ? "success" : "warning",
                });
              }
            }
          } catch {
            // Silenciar si el endpoint no está disponible
            // Proyectos no disponibles
          }

          // Si no hay novedades, mostrar mensaje predeterminado
          if (novedadesTemp.length === 0) {
            novedadesTemp.push({
              id: "default-1",
              titulo: "Bienvenido al Sistema",
              descripcion: "Sistema de Gestión - Dashboard Template",
              fecha: new Date().toISOString(),
              tipo: "success",
            });
          }

          setNovedades(novedadesTemp);
          setCachedData(`${CACHE_KEYS.NOVEDADES}_${userRole}`, novedadesTemp);
          // Novedades cargadas
        } catch {
          console.warn("⚠️ Error al procesar novedades");
        }

        // Página de inicio cargada correctamente
        setLoading(false);
      } catch (error) {
        console.error("❌ Error crítico al cargar datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userRole]); // Agregadas dependencias correctas

  const getNovedadIcon = (tipo: string) => {
    switch (tipo) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-coral" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <FileText className="w-5 h-5 text-accent" />;
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Función para obtener accesos rápidos según rol (4 items)
  const getAccesosRapidos = (): AccesoRapido[] => {
    if (userRole === "admin") {
      return [
        {
          ruta: "/clientes",
          titulo: "Gestionar Clientes",
          descripcion: "Ver y administrar clientes",
          icono: <Building2 className="w-6 h-6" />,
          color: "text-primary",
        },
        {
          ruta: "/tecnicos",
          titulo: "Gestionar Técnicos",
          descripcion: "Ver técnicos activos",
          icono: <UserCog className="w-6 h-6" />,
          color: "text-blue-600",
        },
        {
          ruta: "/ordenes",
          titulo: "Órdenes de Trabajo",
          descripcion: "Ver todas las órdenes",
          icono: <ClipboardList className="w-6 h-6" />,
          color: "text-green-600",
        },
        {
          ruta: "/sucursales",
          titulo: "Sucursales",
          descripcion: "Gestionar sucursales",
          icono: <MapPin className="w-6 h-6" />,
          color: "text-purple-600",
        },
      ];
    } else if (userRole === "tecnico") {
      return [
        {
          ruta: "/ordenes",
          titulo: "Mis Órdenes",
          descripcion: "Órdenes asignadas",
          icono: <ClipboardList className="w-6 h-6" />,
          color: "text-primary",
        },
        {
          ruta: "/auditoria-flash",
          titulo: "Proyectos",
          descripcion: "Ver proyectos activos",
          icono: <Zap className="w-6 h-6" />,
          color: "text-accent",
        },
        {
          ruta: "/documentacion",
          titulo: "Documentación",
          descripcion: "Archivos y documentos",
          icono: <FileText className="w-6 h-6" />,
          color: "text-coral",
        },
        {
          ruta: "/notificaciones",
          titulo: "Notificaciones",
          descripcion: "Ver alertas",
          icono: <Bell className="w-6 h-6" />,
          color: "text-primary",
        },
      ];
    } else {
      // Cliente
      return [
        {
          ruta: "/ordenes",
          titulo: "Órdenes de mi Empresa",
          descripcion: "Ver órdenes activas",
          icono: <ClipboardList className="w-6 h-6" />,
          color: "text-primary",
        },
        {
          ruta: "/empleados",
          titulo: "Empleados",
          descripcion: "Gestionar empleados",
          icono: <Users className="w-6 h-6" />,
          color: "text-accent",
        },
        {
          ruta: "/documentacion",
          titulo: "Documentación",
          descripcion: "Archivos y certificados",
          icono: <FileText className="w-6 h-6" />,
          color: "text-coral",
        },
        {
          ruta: "/auditoria-flash",
          titulo: "Proyectos",
          descripcion: "Nueva solicitud de proyecto",
          icono: <Zap className="w-6 h-6" />,
          color: "text-primary",
        },
      ];
    }
  };

  const accesosRapidos = getAccesosRapidos();

  const getActividadIcon = (tipo: string) => {
    switch (tipo) {
      case "proyecto":
        return <Zap className="w-5 h-5 text-accent" />;
      case "orden":
        return <ClipboardList className="w-5 h-5 text-coral" />;
      case "registro":
        return <Users className="w-5 h-5 text-primary" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <Loading message="Cargando dashboard..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de Bienvenida */}
      <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-3">
            Bienvenido, {nombreEmpresa}
          </h1>
          <p className="text-lg opacity-90">
            Su dashboard de gestión empresarial está listo. Supervise sus
            proyectos, gestione su equipo y manténgase al día con las
            actualizaciones.
          </p>
        </div>
      </Card>

      {/* Cards de Estadísticas */}
      {estadisticas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estadisticas.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                    {stat.valor}
                  </p>
                </div>
                <div
                  className={`p-4 bg-warm-light dark:bg-dark-surface rounded-lg ${stat.color}`}
                >
                  {stat.icono}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Novedades y Notificaciones/Actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Novedades del Sistema */}
        <Card title="Novedades del Sistema" className=" transition-shadow">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {novedades.length > 0 ? (
              novedades.map((novedad) => (
                <div
                  key={novedad.id}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-dark-bg rounded-lg border border-neutral-light dark:border-dark-border hover:border-primary dark:hover:border-primary transition-colors"
                >
                  <div className="mt-1">{getNovedadIcon(novedad.tipo)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-1">
                      {novedad.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {novedad.descripcion}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatFecha(novedad.fecha)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay novedades por el momento</p>
              </div>
            )}
          </div>
        </Card>

        {/* Notificaciones (solo clientes) o Actividades Recientes (admin/técnico) */}
        {userRole === "cliente" ? (
          <Card title="Últimas Notificaciones" className=" transition-shadow">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {notificaciones.length > 0 ? (
                notificaciones.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                      notif.leida
                        ? "bg-white dark:bg-dark-bg border-neutral-light dark:border-dark-border"
                        : "bg-warm-light dark:bg-dark-surface border-primary dark:border-primary"
                    }`}
                  >
                    <Bell
                      className={`w-5 h-5 mt-1 ${
                        notif.leida ? "text-gray-400" : "text-primary"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-1">
                        {notif.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notif.mensaje}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFecha(notif.fecha)}
                      </p>
                    </div>
                    {!notif.leida && (
                      <div
                        className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"
                        aria-label="No leída"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay notificaciones nuevas</p>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card
            title="Actividades Recientes del Sistema"
            className=" transition-shadow"
          >
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {actividadesRecientes.length > 0 ? (
                actividadesRecientes.map((actividad) => (
                  <div
                    key={actividad.id}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-dark-bg rounded-lg border border-neutral-light dark:border-dark-border hover:border-primary dark:hover:border-primary transition-colors"
                  >
                    <div className="mt-1">
                      {getActividadIcon(actividad.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-1">
                        <span className="text-primary dark:text-dark-primary">
                          {actividad.usuario}
                        </span>{" "}
                        {actividad.accion}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {actividad.descripcion}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {formatFecha(actividad.fecha)}
                        </p>
                        {actividad.enlace && (
                          <Link
                            to={actividad.enlace}
                            className="flex items-center gap-1 text-xs font-medium text-primary dark:text-dark-primary hover:underline"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay actividades recientes</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Accesos Rápidos Dinámicos */}
      <Card title="Accesos Rápidos">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accesosRapidos.map((acceso, index) => (
            <Link
              key={index}
              to={acceso.ruta}
              className="flex items-center gap-3 p-4 bg-white dark:bg-dark-bg rounded-lg border border-neutral-light dark:border-dark-border hover:border-primary dark:hover:border-primary hover:shadow-md transition-all"
            >
              <div className={acceso.color}>{acceso.icono}</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                  {acceso.titulo}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {acceso.descripcion}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};
