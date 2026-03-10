import React from "react";
import {
  Users,
  CreditCard,
  Building2,
  ChevronRight,
  Bell,
  Smartphone,
  Database,
  Shield,
} from "lucide-react";

interface ConfigProps {
  // Aquí podrías agregar props si necesitas pasar datos o funciones desde el padre
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Config({ activeView, onViewChange }: ConfigProps) {
  const secciones = [
    {
      id: "general",
      titulo: "General",
      desc: "Razón Social, logo, dirección y datos fiscales del taller.",
      icon: <Building2 className="text-primary-500" />,
    },
    {
      id: "usuarios",
      titulo: "Usuarios y Permisos",
      desc: "Gestiona quién tiene acceso y qué puede hacer.",
      icon: <Users className="text-primary-500" />,
    },
    {
      id: "licencias",
      titulo: "Plan y Licencia",
      desc: "Estado de suscripción, facturación y límites del plan.",
      icon: <CreditCard className="text-primary-500" />,
    },
    {
      id: "sistema",
      titulo: "Sistema",
      desc: "Copias de seguridad, idioma y logs de actividad.",
      icon: <Database className="text-primary-500" />,
    },
  ];

  return (
    <main
      className="p-4 lg:p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500"
      role="main"
      aria-label="Panel de Configuración"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
          Configuración
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Administra las preferencias generales de Motor Cloud y los datos de tu
          negocio.
        </p>
      </div>

      {/* Grid Principal de Secciones */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secciones.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (typeof onViewChange === "function") {
                onViewChange(item.id);
              }
            }}
            className={`group flex items-start gap-4 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-soft hover:border-primary-300 dark:hover:border-primary-900/50 hover:shadow-medium transition-all text-left outline-none focus:ring-2 focus:ring-primary-500 ${
              activeView === item.id
                ? "border-primary-500 dark:border-primary-400"
                : ""
            }`}
          >
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 group-hover:scale-110 transition-transform">
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {item.titulo}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {item.desc}
              </p>
            </div>
            <ChevronRight
              className="text-neutral-300 dark:text-neutral-700 group-hover:text-primary-400 transition-colors mt-1"
              size={20}
            />
          </button>
        ))}
      </section>

      {/* Configuración Rápida / Otros Ajustes */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white px-1">
          Preferencias Rápidas
        </h2>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-soft">
          {[
            {
              icon: <Bell size={18} />,
              label: "Notificaciones por WhatsApp",
              type: "toggle",
            },
            {
              icon: <Shield size={18} />,
              label: "Autenticación de dos pasos",
              type: "toggle",
            },
            {
              icon: <Smartphone size={18} />,
              label: "Modo Tablet / Móvil",
              type: "toggle",
            },
          ].map((option, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                <span className="text-neutral-400">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              {/* Toggle Switch Simple */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Informativo */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500 uppercase tracking-widest font-bold">
        <span>Última copia de seguridad: Hoy, 14:00 hs</span>
        <span className="text-primary-600 dark:text-primary-500">
          ID de Instancia: MC-ARG-001
        </span>
      </div>
    </main>
  );
}
