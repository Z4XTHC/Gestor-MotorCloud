import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Search,
  Settings,
  ZoomIn,
  ZoomOut,
  Menu,
  Info,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import axiosInstance from "../../api/axiosConfig";
import { API_ENDPOINTS } from "../../constants/api";
import { Notificacion } from "../../types";

interface HeaderProps {
  onMenuClick: () => void;
  collapsed?: boolean;
}

export const Header = ({ onMenuClick, collapsed = false }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, scale, setScale } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [contadorNoLeidas, setContadorNoLeidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Determinar el rol del usuario basado en la estructura de MongoDB
  const getUserRole = () => {
    if (!user) return "Usuario";
    if (user.admin === true) return "Administrador";
    if (user.tecnico_id) return "Técnico";
    if (user.cliente_id) return "Cliente";
    return "Usuario";
  };

  // Obtener el nombre para mostrar (email antes del @)
  const getDisplayName = () => {
    if (!user?.email) return "Usuario";
    return user.email.split("@")[0];
  };

  // Obtener información detallada para mostrar
  const getUserInfo = () => {
    if (!user) return { role: "Usuario", detail: "" };

    if (user.admin === true) {
      return { role: "Administrador", detail: "Acceso completo" };
    }

    if (user.tecnico_id) {
      return { role: "Técnico", detail: `ID: ${user.tecnico_id}` };
    }

    if (user.cliente_id) {
      return { role: "Cliente", detail: `ID: ${user.cliente_id}` };
    }

    return { role: "Usuario", detail: "" };
  };

  // Cargar notificaciones no leídas (solo para usuarios cliente)
  const fetchNotificaciones = async () => {
    if (!user) return;

    // Solo los usuarios con `cliente_id` deben consultar notificaciones.
    // Técnicos o usuarios sin cliente pueden provocar 401 si no existen en la DB.
    if (!user.cliente_id) {
      setNotificaciones([]);
      setContadorNoLeidas(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.NOTIFICACIONES.LIST,
        {
          headers: {
            "x-skip-auth-redirect": "true",
          },
        },
      );
      const data = Array.isArray(response.data) ? response.data : [];

      // Filtrar solo las no leídas, validar campos requeridos y tomar las últimas 5
      const noLeidas = data.filter((n: Notificacion) => !n.leida && n._id);

      // Si no hay no leídas, mostrar las últimas 5 (aunque estén leídas)
      const notificacionesAMostrar =
        noLeidas.length > 0 ? noLeidas.slice(0, 5) : data.slice(0, 5);

      setNotificaciones(notificacionesAMostrar);
      setContadorNoLeidas(noLeidas.length);
    } catch (error) {
      const axiosError = error as {
        response?: { status?: number };
        message?: string;
      };
      // Silenciar 401/403 (no autorizado) para no mostrar errores en consola en caso de permisos
      if (
        !(
          axiosError?.response?.status === 401 ||
          axiosError?.response?.status === 403
        )
      ) {
        console.warn(
          "Error al cargar notificaciones:",
          axiosError?.message || error,
        );
      }
      // En caso de error, limpiar notificaciones sin causar logout
      setNotificaciones([]);
      setContadorNoLeidas(0);
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones al montar y cada 60 segundos
  useEffect(() => {
    if (user) {
      fetchNotificaciones();
      const interval = setInterval(fetchNotificaciones, 60000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Detectar si la app se puede instalar como PWA
  useEffect(() => {
    const handler = (e: Event) => {
      // Prevenir que el navegador muestre su propio prompt
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Manejar instalación de la PWA
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar a que el usuario responda al prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      Swal.fire({
        icon: "success",
        title: "¡Instalación exitosa!",
        text: "La aplicación se instaló correctamente en tu dispositivo",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    // Limpiar el prompt usado
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Obtener ícono según tipo de notificación
  const getTipoIcon = (tipo: string | undefined) => {
    if (!tipo) return <Bell className="w-4 h-4" />;

    switch (tipo.toLowerCase()) {
      case "info":
        return <Bell className="w-4 h-4" />;
      case "warning":
        return <AlertCircle className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "orden":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Formatear tiempo relativo
  const getTimeAgo = (fecha: string) => {
    const ahora = new Date();
    const then = new Date(fecha);
    const diffMs = ahora.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  const handleScaleChange = () => {
    const scales: Array<"small" | "normal" | "large"> = [
      "small",
      "normal",
      "large",
    ];
    const currentIndex = scales.indexOf(scale);
    const nextIndex = (currentIndex + 1) % scales.length;
    setScale(scales[nextIndex]);
  };

  const handleToggleTheme = async () => {
    const willSwitchToDark = theme === "light";

    if (willSwitchToDark) {
      try {
        const result = await Swal.fire({
          title: "Modo oscuro (beta)",
          text: "El modo oscuro está en beta y puede causar problemas visuales. ¿Desea activarlo?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Activar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#F39F23",
        });

        if (result.isConfirmed) {
          toggleTheme();
        }
      } catch (e) {
        // Si falla SweetAlert por alguna razón, permitir el cambio para no bloquear UX
        toggleTheme();
      }
    } else {
      toggleTheme();
    }
  };

  const scaleLabels = {
    small: "Pequeño (90%)",
    normal: "Normal (100%)",
    large: "Grande (110%)",
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 ${
        collapsed ? "lg:left-20" : "lg:left-64"
      } bg-white dark:bg-dark-surface border-b border-primary-lighter dark:border-dark-bg z-30 h-16 transition-all duration-300`}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-primary dark:text-dark-primary"
            aria-label="Menú"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface rounded-lg border border-primary-lighter dark:border-dark-bg hover:border-primary dark:hover:border-dark-primary transition-colors w-full max-w-md"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm hidden md:inline">
              Buscar... (Ctrl+K)
            </span>
          </button> */}
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={handleScaleChange}
            className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-surface rounded-lg transition-colors text-primary dark:text-dark-primary"
            title={scaleLabels[scale]}
            aria-label="Cambiar tamaño de interfaz"
          >
            {scale === "small" ? (
              <ZoomOut className="w-5 h-5" />
            ) : (
              <ZoomIn className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={handleToggleTheme}
            className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-surface rounded-lg transition-colors text-primary dark:text-dark-primary"
            aria-label="Cambiar tema"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Notificaciones - Solo para usuarios con cliente_id */}
          {user?.cliente_id && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-primary dark:text-dark-primary relative"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {contadorNoLeidas > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface rounded-lg shadow-primary-lg border border-neutral-light dark:border-dark-bg z-50">
                  <div className="p-4 border-b border-neutral-light dark:border-dark-bg flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                      Notificaciones
                    </h3>
                    {contadorNoLeidas > 0 && (
                      <span className="px-2 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                        {contadorNoLeidas}
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : notificaciones.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No hay notificaciones nuevas
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-light dark:divide-dark-bg">
                        {notificaciones.map((notif) => (
                          <Link
                            key={notif._id}
                            to="/notificaciones"
                            onClick={() => setShowNotifications(false)}
                            className={`block p-4 hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors ${
                              !notif.leida
                                ? "bg-blue-50 dark:bg-blue-900/10"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-primary dark:text-dark-primary mt-1">
                                {getTipoIcon(notif.tipo)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900 dark:text-dark-text text-sm line-clamp-2">
                                    {notif.textoDescriptivo ||
                                      "Sin descripción"}
                                  </p>
                                  {!notif.leida && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {getTimeAgo(
                                      notif.createdAt ||
                                        new Date().toISOString(),
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-neutral-light dark:border-dark-bg">
                    <Link
                      to="/notificaciones"
                      className="text-sm text-primary dark:text-dark-primary hover:underline block text-center"
                      onClick={() => setShowNotifications(false)}
                    >
                      Ver todas las notificaciones →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 lg:gap-3 p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getUserRole()}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-dark-surface rounded-lg shadow-primary-lg border border-neutral-light dark:border-dark-bg">
                <div className="p-4 border-b border-neutral-light dark:border-dark-bg">
                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                    {getDisplayName()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {user?.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-dark-primary/10 dark:text-dark-primary">
                      {getUserRole()}
                    </span>
                  </div>
                  {getUserInfo().detail && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-mono">
                      {getUserInfo().detail}
                    </p>
                  )}
                </div>
                <nav className="p-2">
                  <Link
                    to="/perfil"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors text-gray-700 dark:text-gray-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </Link>
                  {user?.admin === true && (
                    <Link
                      to="/configuracion"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors text-gray-700 dark:text-gray-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configuración</span>
                    </Link>
                  )}
                  {showInstallButton && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleInstallClick();
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors text-gray-700 dark:text-gray-300 w-full text-left"
                    >
                      <Download className="w-4 h-4" />
                      <span>Instalar MangoSoft</span>
                    </button>
                  )}
                  <Link
                    to="/acerca-de"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors text-gray-700 dark:text-gray-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Info className="w-4 h-4" />
                    <span>Acerca de</span>
                  </Link>
                </nav>
                <div className="p-2 border-t border-neutral-light dark:border-dark-bg">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-100 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
