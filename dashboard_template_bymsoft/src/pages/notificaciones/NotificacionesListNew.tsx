import { useState, useEffect } from "react";
import {
  Bell,
  BellOff,
  Trash2,
  Check,
  Filter,
  RefreshCw,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Notificacion } from "../../types";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/api";
import {
  obtenerNotificaciones,
  marcarNotificacionComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
} from "../../api/notificacionApi";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { useCache } from "../../contexts/CacheContext";
import { NotificacionesDetalles } from "./NotificacionesDetalles";
import { Select } from "../../components/common/Select";

/**
 * Tipos para filtros de notificaciones
 */
type TipoFilter = "all" | "info" | "warning" | "error" | "success";
type LeidaFilter = "all" | "leidas" | "noLeidas";

/**
 * Componente principal de gestión de notificaciones
 *
 * Características:
 * - Lista todas las notificaciones del usuario autenticado
 * - Filtros por tipo (info, warning, error, success) y estado (leídas/no leídas)
 * - Marcar como leída/no leída individualmente o en masa
 * - Eliminar notificaciones manualmente
 * - Ver detalles en modal
 * - Actualización automática cada 30 segundos
 * - Badge con contador de no leídas
 * - Integración con sistema de caché
 * - Auto-eliminación de notificaciones mayores a 31 días (backend)
 *
 * @returns {JSX.Element} Vista de lista de notificaciones
 */
export const NotificacionesList = () => {
  const { user } = useAuth();
  const {
    getNotificaciones,
    setNotificaciones: setCacheNotificaciones,
    isCacheValid,
    clearNotificaciones,
  } = useCache();

  // Estados principales
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotificacion, setSelectedNotificacion] =
    useState<Notificacion | null>(null);

  // Estados de filtros
  const [tipoFilter, setTipoFilter] = useState<TipoFilter>("all");
  const [leidaFilter, setLeidaFilter] = useState<LeidaFilter>("all");

  /**
   * Obtiene la lista de notificaciones desde la API o caché
   *
   * Flujo:
   * 1. Verifica si hay datos en caché válidos
   * 2. Si hay caché, lo usa y evita llamada a API
   * 3. Si no hay caché, hace petición al backend
   * 4. Guarda respuesta en caché para futuras consultas
   *
   * @async
   */
  const fetchNotificaciones = async () => {
    // Evitar llamadas si el usuario no tiene asociación (técnico o cliente) y no es admin
    if (!user) {
      setNotificaciones([]);
      setLoading(false);
      return;
    }

    // Sólo clientes (o admins con cliente) pueden consultar notificaciones.
    if (!user?.cliente_id) {
      setNotificaciones([]);
      setLoading(false);
      return;
    }

    // Verificar que tenemos token antes de hacer la petición
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Intentar usar caché primero
    const cachedNotificaciones = getNotificaciones();
    if (cachedNotificaciones && isCacheValid("notificaciones")) {
      setNotificaciones(cachedNotificaciones);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Usar helper API
      const data = await obtenerNotificaciones();

      // `obtenerNotificaciones` normalmente devuelve el array directamente.
      if (Array.isArray(data)) {
        setNotificaciones(data);
        setCacheNotificaciones(data);
      } else if (
        data &&
        typeof data === "object" &&
        Array.isArray(data.notificaciones)
      ) {
        setNotificaciones(data.notificaciones);
        setCacheNotificaciones(data.notificaciones);
      } else {
        setNotificaciones([]);
        setCacheNotificaciones([]);
      }
    } catch (error: any) {
      console.error("Error al cargar notificaciones:", error.message);
      setNotificaciones([]);

      // Solo mostrar error si no es 401 o 403 (que redirigen automáticamente)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.error ||
            "No se pudieron cargar las notificaciones",
          confirmButtonColor: "#F39F23",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hook de inicialización y actualización automática
   *
   * - Carga notificaciones al montar
   * - Actualiza cada 30 segundos para notificaciones en tiempo real
   * - Limpia interval al desmontar
   */
  useEffect(() => {
    fetchNotificaciones();

    // Polling cada 30 segundos
    const interval = setInterval(() => {
      fetchNotificaciones();
    }, 30000);

    return () => {
      clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Filtra notificaciones según criterios seleccionados
   *
   * @returns {Notificacion[]} Array de notificaciones filtradas
   */
  const filteredNotificaciones = notificaciones.filter((notif) => {
    // Filtro por tipo
    if (tipoFilter !== "all" && notif.tipo !== tipoFilter) {
      return false;
    }

    // Filtro por leída
    if (leidaFilter === "leidas" && !notif.leida) {
      return false;
    }
    if (leidaFilter === "noLeidas" && notif.leida) {
      return false;
    }

    return true;
  });

  /**
   * Cuenta notificaciones no leídas
   *
   * @returns {number} Cantidad de notificaciones no leídas
   */
  const contadorNoLeidas = notificaciones.filter((n) => !n.leida).length;

  /**
   * Retorna el ícono según el tipo de notificación
   *
   * @param {string} tipo - Tipo de notificación
   * @returns {JSX.Element} Ícono correspondiente
   */
  const getTipoIcon = (tipo?: string) => {
    switch (tipo) {
      case "info":
        return <Info className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  /**
   * Retorna la clase de color según el tipo de notificación
   *
   * @param {string} tipo - Tipo de notificación
   * @returns {string} Clases Tailwind CSS
   */
  const getTipoColor = (tipo?: string) => {
    switch (tipo) {
      case "info":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "error":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "success":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  /**
   * Marca/desmarca una notificación como leída
   *
   * @param {Notificacion} notificacion - Notificación a actualizar
   * @async
   */
  const toggleLeida = async (notificacion: Notificacion) => {
    try {
      const notifId = notificacion._id || notificacion.id || "";

      // Si ya está leída, no hacemos nada (backend solo tiene endpoint para marcar como leída)
      if (notificacion.leida) {
        Swal.fire({
          icon: "info",
          title: "Información",
          text: "Esta notificación ya está marcada como leída",
          confirmButtonColor: "#F39F23",
        });
        return;
      }

      await marcarNotificacionComoLeida(notifId);

      clearNotificaciones();
      fetchNotificaciones();
    } catch (error) {
      console.error("Error updating notificacion:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la notificación",
        confirmButtonColor: "#F39F23",
      });
    }
  };

  /**
   * Marca todas las notificaciones como leídas
   *
   * @async
   */
  const marcarTodasLeidas = async () => {
    const noLeidas = notificaciones.filter((n) => !n.leida);

    if (noLeidas.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No hay notificaciones sin leer",
        confirmButtonColor: "#F39F23",
      });
      return;
    }

    try {
      console.log(`🔄 Marcando todas las notificaciones como leídas...`);

      // Usar helper API para marcar todas
      await marcarTodasComoLeidas();

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: `${noLeidas.length} notificación${
          noLeidas.length > 1 ? "es" : ""
        } marcada${noLeidas.length > 1 ? "s" : ""} como leída${
          noLeidas.length > 1 ? "s" : ""
        }`,
        confirmButtonColor: "#F39F23",
        timer: 2000,
      });

      clearNotificaciones();
      fetchNotificaciones();
    } catch (error: any) {
      console.error("❌ Error al marcar todas como leídas:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudieron actualizar las notificaciones",
        confirmButtonColor: "#F39F23",
      });
    }
  };

  /**
   * Elimina una notificación
   *
   * @param {string} id - ID de la notificación a eliminar
   * @async
   */
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar notificación?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarNotificacion(id);

        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "La notificación se eliminó correctamente",
          confirmButtonColor: "#F39F23",
          timer: 2000,
        });

        clearNotificaciones();
        fetchNotificaciones();
      } catch (error) {
        console.error("Error deleting notificacion:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la notificación",
          confirmButtonColor: "#F39F23",
        });
      }
    }
  };

  /**
   * Formatea fecha relativa (hace X tiempo)
   *
   * @param {string | undefined} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatFechaRelativa = (dateString?: string) => {
    if (!dateString) return "Fecha desconocida";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60)
      return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24)
      return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
    if (diffDays < 31) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? "s" : ""}`;
    }

    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
              Notificaciones
            </h1>
            {contadorNoLeidas > 0 && (
              <span className="bg-coral text-white px-3 py-1 rounded-full text-sm font-semibold">
                {contadorNoLeidas}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Centro de notificaciones y alertas del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<RefreshCw className="w-5 h-5" />}
            variant="secondary"
            onClick={fetchNotificaciones}
          >
            Actualizar
          </Button>
          {contadorNoLeidas > 0 && (
            <Button
              icon={<Check className="w-5 h-5" />}
              onClick={marcarTodasLeidas}
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      {/* Card Principal */}
      <Card>
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filtros:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Por tipo
              </label>
              <Select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value as TipoFilter)}
                className="w-full px-3 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              >
                <option value="all">Todas</option>
                <option value="info">Información</option>
                <option value="success">Éxito</option>
                <option value="warning">Advertencia</option>
                <option value="error">Error</option>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Por estado
              </label>
              <Select
                value={leidaFilter}
                onChange={(e) => setLeidaFilter(e.target.value as LeidaFilter)}
                className="w-full px-3 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              >
                <option value="all">Todas</option>
                <option value="noLeidas">No leídas</option>
                <option value="leidas">Leídas</option>
              </Select>
            </div>
          </div>

          {/* Contador */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredNotificaciones.length} de {notificaciones.length}{" "}
            notificación{notificaciones.length !== 1 ? "es" : ""}
          </div>
        </div>

        {/* Lista de notificaciones */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-neutral-light dark:bg-dark-bg rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filteredNotificaciones.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {notificaciones.length === 0
                ? "No tienes notificaciones"
                : "No se encontraron notificaciones con los filtros aplicados"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotificaciones.map((notificacion) => (
              <div
                key={notificacion._id || notificacion.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                  notificacion.leida
                    ? "border-neutral-light dark:border-dark-bg bg-white dark:bg-dark-bg opacity-70"
                    : "border-primary/30 dark:border-primary/20 bg-primary-lighter/20 dark:bg-dark-surface"
                }`}
                onClick={() => setSelectedNotificacion(notificacion)}
              >
                <div className="flex items-start gap-4">
                  {/* Ícono de tipo */}
                  <div
                    className={`p-2 rounded-lg ${getTipoColor(
                      notificacion.tipo
                    )}`}
                  >
                    {getTipoIcon(notificacion.tipo)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-gray-900 dark:text-dark-text ${
                        !notificacion.leida ? "font-semibold" : ""
                      }`}
                    >
                      {notificacion.textoDescriptivo}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatFechaRelativa(notificacion.createdAt)}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLeida(notificacion);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        notificacion.leida
                          ? "hover:bg-primary-lighter dark:hover:bg-dark-bg text-gray-600 dark:text-gray-400"
                          : "hover:bg-primary-lighter dark:hover:bg-dark-bg text-primary dark:text-dark-primary"
                      }`}
                      title={
                        notificacion.leida
                          ? "Marcar como no leída"
                          : "Marcar como leída"
                      }
                    >
                      {notificacion.leida ? (
                        <BellOff className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notificacion._id || notificacion.id || "");
                      }}
                      className="p-2 hover:bg-coral/20 rounded-lg transition-colors text-coral"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal de detalles */}
      {selectedNotificacion && (
        <NotificacionesDetalles
          notificacion={selectedNotificacion}
          onClose={() => setSelectedNotificacion(null)}
          onToggleLeida={() => {
            toggleLeida(selectedNotificacion);
            setSelectedNotificacion(null);
          }}
          onDelete={() => {
            handleDelete(
              selectedNotificacion._id || selectedNotificacion.id || ""
            );
            setSelectedNotificacion(null);
          }}
        />
      )}
    </div>
  );
};
