import React, { useState } from "react";
import {
  Cloud,
  Settings,
  Users,
  BarChart3,
  ExternalLink,
  Code2,
  Calendar,
  MessageCircle,
  Globe,
  Car,
  ClipboardList,
  RefreshCw,
  ShieldCheck,
  Send,
  AlertTriangle,
  Lightbulb,
  LifeBuoy,
} from "lucide-react";

export function AcercaDe() {
  // Simulación de versión y estado para el botón de actualización
  const appVersion = "1.0 beta";
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckUpdates = () => {
    setIsChecking(true);
    console.log("Buscando actualizaciones...");
    setTimeout(() => setIsChecking(false), 2000);
  };

  return (
    <main
      className="p-4 lg:p-6 space-y-8 lg:space-y-12 max-w-6xl mx-auto animate-in fade-in duration-500"
      role="main"
      aria-label="Acerca de Motor Cloud"
    >
      {/* Hero Section & Version Control */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 p-8 lg:p-12 text-white shadow-strong">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-bold uppercase tracking-wider">
                <Cloud className="w-3.5 h-3.5" />
                SaaS - Argentina
              </span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-medium">
                v{appVersion}
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
              Motor <span className="text-primary-500">Cloud</span>
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Plataforma integral en la nube para la gestión de talleres, con
              infraestructura local en Argentina para garantizar la mayor
              velocidad y soporte técnico.
            </p>
          </div>

          <button
            onClick={handleCheckUpdates}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-all text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`}
            />
            {isChecking ? "Buscando..." : "Revisar actualizaciones"}
          </button>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-600/10 blur-[100px] rounded-full" />
      </section>

      {/* Grid de Servicios Expandido */}
      <section aria-label="Nuestros servicios" className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary-500 rounded-full" />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Solución Todo-en-Uno
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <ClipboardList />, text: "Gestión de OT" },
            { icon: <Settings />, text: "Inventario Real-time" },
            { icon: <Users />, text: "Panel de Clientes" },
            { icon: <Car />, text: "Control de Vehículos" },
            { icon: <ShieldCheck />, text: "Gestión de Usuarios" },
            { icon: <Calendar />, text: "Calendario de Trabajos" },
            { icon: <BarChart3 />, text: "Reportes de Finanzas" },
            { icon: <MessageCircle />, text: "Mensajes WhatsApp" },
            { icon: <Globe />, text: "URL Personalizada" },
            { icon: <Cloud />, text: "Alojamiento en Argentina" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-soft hover:border-primary-300 dark:hover:border-primary-900/50 transition-colors"
            >
              <div className="text-primary-500">
                {React.cloneElement(item.icon, { size: 20 })}
              </div>
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Sugerencias y Soporte */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 border-t border-neutral-200 dark:border-neutral-800"
        aria-labelledby="feedback-title"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <LifeBuoy className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wider text-sm">
              Feedback
            </span>
          </div>
          <h2
            id="feedback-title"
            className="text-3xl font-black text-neutral-900 dark:text-white"
          >
            Tu opinión nos hace <span className="text-primary-500">crecer</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            ¿Encontraste un error o tienes una idea? Escríbenos. Revisamos cada
            mensaje para que Motor Cloud sea la mejor herramienta para tu
            taller.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20 text-primary-600">
                <AlertTriangle size={18} />
              </div>
              Reportar errores técnicos
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/20 text-accent-600">
                <Lightbulb size={18} />
              </div>
              Sugerir nuevas funcionalidades
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form
          className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-medium space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-2">
            <label
              htmlFor="tipo"
              className="text-sm font-bold text-neutral-700 dark:text-neutral-300"
            >
              Categoría
            </label>
            <select
              id="tipo"
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-neutral-900 dark:text-white"
            >
              <option value="sugerencia">💡 Sugerencia</option>
              <option value="error">⚠️ Reportar Error</option>
              <option value="reclamo">📢 Reclamo / Queja</option>
              <option value="otro">💬 Otro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="mensaje"
              className="text-sm font-bold text-neutral-700 dark:text-neutral-300"
            >
              Mensaje
            </label>
            <textarea
              id="mensaje"
              rows="4"
              placeholder="Escribe aquí tu sugerencia o reporte..."
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-neutral-900 dark:text-white resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Enviar Comentario
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* Footer: Mangosoft */}
      <section
        className="rounded-2xl border border-primary-100 dark:border-primary-900/20 bg-primary-50/30 dark:bg-primary-950/10 p-6 lg:p-10"
        aria-label="Empresa desarrolladora"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-700 dark:text-primary-500">
                Desarrollo por
              </span>
            </div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              MANGO SOFTWARE
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-lg">
              Expertos en la creación de software escalable y eficiente.
              Impulsamos la digitalización de negocios con tecnología de punta.
            </p>
          </div>

          <a
            href="https://mangosofts.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-medium transition-all hover:-translate-y-1 active:scale-95 outline-none focus:ring-4 focus:ring-primary-200"
          >
            Visitar Sitio Oficial
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </section>
    </main>
  );
}
