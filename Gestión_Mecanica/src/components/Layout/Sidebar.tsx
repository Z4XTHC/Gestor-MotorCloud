import React from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Car,
  Settings,
  BarChart3,
  X,
  Info,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

// Categories with menu items (keeps the original icons and labels)
const menuCategories = [
  {
    id: "principal",
    label: "Principal",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "calendar", label: "Calendario", icon: ClipboardList },
    ],
  },
  {
    id: "gestion",
    label: "Gestión",
    items: [
      { id: "inventory", label: "Inventario", icon: Package },
      { id: "orders", label: "Órdenes de Trabajo", icon: ClipboardList },
      { id: "clients", label: "Clientes", icon: Users },
      { id: "vehiculos", label: "Vehículos", icon: Car },
      { id: "proveedores", label: "Proveedores", icon: Users },
    ],
  },
  {
    id: "informes",
    label: "Informes",
    items: [{ id: "reports", label: "Reportes", icon: BarChart3 }],
  },
  {
    id: "config",
    label: "Configuración",
    items: [
      { id: "settings", label: "Configuración", icon: Settings },
      { id: "about", label: "Acerca de la App", icon: Info },
    ],
  },
];

export function Sidebar({
  isOpen,
  onClose,
  activeView,
  onViewChange,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-full w-60 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0
      `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Motor Cloud
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>

        <nav
          className="px-3 py-4"
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="space-y-4">
            {menuCategories.map((cat, idx) => (
              <li key={cat.id}>
                {idx > 0 && (
                  <div className="px-3">
                    <div className="border-t border-neutral-200 dark:border-neutral-800 my-2" />
                  </div>
                )}
                {/* Category header */}
                <div className="px-3 mb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  {cat.label}
                </div>

                <ul className="space-y-2">
                  {cat.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            onViewChange(item.id);
                            onClose();
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                            ${
                              isActive
                                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500"
                                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                            }
                          `}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon
                            className={`w-5 h-5 ${isActive ? "text-primary-500" : ""}`}
                          />
                          <span className="font-medium text-sm">
                            {item.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
