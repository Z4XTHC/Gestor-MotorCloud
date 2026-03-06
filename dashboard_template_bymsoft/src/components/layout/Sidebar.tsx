import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCog,
  GraduationCap,
  FileText,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  X,
  Info,
  Bot,
  Car,
  User,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  children?: { path: string; label: string }[];
  roles?: string[]; // Roles permitidos (undefined = todos)
  disabled?: boolean; // Si true, no redirige y muestra nota
  note?: string; // Nota descriptiva corta para mostrar al usuario
  category?: string; // Categoría para agrupar items
}

interface NavCategory {
  id: string;
  label: string;
  description: string; // Descripción breve para tooltip
  items: NavItem[];
  collapsible?: boolean; // Si la categoría puede colapsarse
  roles?: string[]; // Roles que pueden ver esta categoría
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

// Categorías organizadas (los disabled están comentados para ocultarlos)
const navCategories: NavCategory[] = [
  {
    id: "principal",
    label: "Principal",
    description: "Panel de control y notificaciones del sistema",
    collapsible: true,
    items: [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        category: "principal",
      },
      {
        path: "/notificaciones",
        label: "Notificaciones",
        icon: <Bell className="w-5 h-5" />,
        category: "principal",
      },
    ],
  },
  {
    id: "gestion",
    label: "Gestión",
    description: "Gestión de usuarios, clientes, vehículos y ordenes",
    collapsible: true,
    items: [
      {
        path: "/ordenes",
        label: "Ordenes",
        icon: <FileText className="w-5 h-5" />,
        category: "gestion",
      },
      {
        path: "/clientes",
        label: "Clientes",
        icon: <User className="w-5 h-5" />,
        category: "gestion",
      },
      {
        path: "/vehiculos",
        label: "Vehículos",
        icon: <Car className="w-5 h-5" />,
        category: "gestion",
      },
    ],
  },
  {
    id: "ejemplos",
    label: "Ejemplos",
    description: "Páginas de ejemplo para el template",
    collapsible: true,
    items: [
      {
        path: "/sample-page-1",
        label: "Página de Ejemplo 1",
        icon: <FileText className="w-5 h-5" />,
        category: "ejemplos",
      },
      {
        path: "/sample-page-2",
        label: "Página de Ejemplo 2",
        icon: <FileText className="w-5 h-5" />,
        category: "ejemplos",
      },
      {
        path: "/sample-page-3",
        label: "Página de Ejemplo 3",
        icon: <FileText className="w-5 h-5" />,
        category: "ejemplos",
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    description: "Configuración del sistema",
    collapsible: true,
    items: [
      {
        path: "/configuracion",
        label: "Configuración General",
        icon: <Settings className="w-5 h-5" />,
        category: "configuracion",
      },
      {
        path: "/usuarios",
        label: "Usuarios",
        icon: <Users className="w-5 h-5" />,
        category: "gestion",
        roles: ["admin"], // Solo admins pueden ver este item
      },
      {
        path: "/perfil",
        label: "Perfil de Usuario",
        icon: <UserCog className="w-5 h-5" />,
        category: "configuracion",
      },
      {
        path: "/acerca-de",
        label: "Acerca de",
        icon: <Info className="w-5 h-5" />,
        category: "configuracion",
      },
    ],
  },
];

export const Sidebar = ({
  isOpen,
  onClose,
  collapsed,
  onCollapsedChange,
}: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  // Estado para controlar submenús colapsables (todas las categorías expandidas por defecto)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "principal",
    "gestion",
    "ejemplos",
    "configuracion",
  ]);

  // Determinar rol del usuario
  const getUserRole = (): string => {
    if (!user) return "guest";
    if (user.rol === "ADMIN") return "admin";
    return "user";
  };

  const userRole = getUserRole();
  console.log(getUserRole());

  // Filtrar categorías y items según rol del usuario
  const getFilteredCategories = (): NavCategory[] => {
    return navCategories
      .map((category) => {
        // Filtrar items de la categoría
        const filteredItems = category.items.filter((item) => {
          // Ocultar items deshabilitados
          if (item.disabled) return false;

          // Lógica especial para notificaciones
          if (item.path === "/notificaciones") {
            if (user?.rol === "ADMIN") {
              return false;
            }
          }

          // Si el item no tiene restricción de roles, mostrarlo
          if (!item.roles || item.roles.length === 0) return true;

          // Verificar si el rol del usuario está permitido
          return item.roles.includes(userRole);
        });

        return {
          ...category,
          items: filteredItems,
        };
      })
      .filter((category) => {
        // Ocultar categorías vacías
        if (category.items.length === 0) return false;

        // Verificar roles de la categoría
        if (category.roles && category.roles.length > 0) {
          return category.roles.includes(userRole);
        }

        return true;
      });
  };

  const filteredCategories = getFilteredCategories();

  // Toggle de categoría colapsable
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-dark-surface dark:bg-dark-surface transition-all duration-300 z-40 flex flex-col ${
          collapsed ? "w-20" : "w-64"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:flex`}
      >
        {/* Botón cerrar en móvil */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden text-white hover:bg-white/10 rounded-lg p-1"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className={`p-6 flex items-center border-b border-primary dark:border-dark-bg ${
            collapsed ? "flex-col gap-4" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3 flex-1">
              <img
                src="/images/MangoSoft.png"
                alt="MangoSoft Logo"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <h1 className="text-white dark:text-dark-text font-bold text-lg">
                  Motor Cloud
                </h1>
                <p className="text-white/70 dark:text-dark-text/70 text-xs">
                  v1.0
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <img
              src="/images/MangoSoft.png"
              alt="MangoSoft Logo"
              className="h-8 w-8 rounded-full"
            />
          )}
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="text-white dark:text-dark-text hover:bg-primary-dark dark:hover:bg-dark-bg p-2 rounded-lg transition-colors"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto ${collapsed ? "p-2" : "p-4"}`}>
          <ul className="space-y-1">
            {filteredCategories.map((category, categoryIndex) => {
              const isCategoryExpanded = expandedCategories.includes(
                category.id,
              );
              const isCollapsible = category.collapsible && !collapsed;

              return (
                <li key={category.id}>
                  {/* Separador de categoría con línea y tooltip */}
                  {!collapsed && (
                    <div className="px-3 py-2 mt-4 first:mt-0">
                      {/* Línea separadora */}
                      {categoryIndex > 0 && (
                        <div className="border-t border-primary dark:border-dark-text/10 mb-3" />
                      )}

                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-white/60 dark:text-dark-text/60 uppercase tracking-wider hover:text-white/80 transition-colors group"
                        aria-expanded={isCategoryExpanded}
                        aria-label={`${isCategoryExpanded ? "Colapsar" : "Expandir"} sección ${category.label}`}
                        title={category.description}
                      >
                        <span className="flex items-center gap-2">
                          {category.label}
                          <Info className="w-3 h-3 text-white group-hover:text-white/60 transition-colors" />
                        </span>
                        {isCategoryExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Items de la categoría */}
                  {(!isCollapsible || isCategoryExpanded) && (
                    <ul className={`space-y-1 ${!collapsed ? "mt-1" : ""}`}>
                      {category.items.map((item) => {
                        const isActive = location.pathname.startsWith(
                          item.path,
                        );

                        const baseClass = `flex ${
                          collapsed
                            ? "items-center justify-center"
                            : "items-start justify-start text-left"
                        } gap-3 ${
                          collapsed ? "p-3" : "px-4 py-2.5"
                        } rounded-lg transition-all min-w-0 w-full ${
                          isActive
                            ? "bg-primary text-white dark:bg-dark-primary dark:text-dark-bg"
                            : "text-white/90 dark:text-dark-text hover:bg-primary-dark dark:hover:bg-dark-bg"
                        }`;

                        return (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              onClick={onClose}
                              className={baseClass}
                              title={collapsed ? item.label : undefined}
                            >
                              {item.icon}
                              {!collapsed && (
                                <span className="font-medium flex-1 break-words text-sm">
                                  {item.label}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 bg-dark-surface dark:bg-dark-surface border-t border-primary-dark lg:hidden z-40">
        <nav className="flex justify-around p-2">
          {/* Obtener los primeros 5 items activos para móvil */}
          {filteredCategories
            .flatMap((cat) => cat.items)
            .slice(0, 5)
            .map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              const mobileClass = `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-primary-dark text-white"
                  : "text-white hover:bg-dark-bg/50"
              }`;

              return (
                <Link key={item.path} to={item.path} className={mobileClass}>
                  {item.icon}
                  <span className="text-xs truncate max-w-[60px]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </nav>
      </div>
    </>
  );
};
