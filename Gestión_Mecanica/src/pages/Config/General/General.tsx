import React, { useState } from "react";
import {
  Building2,
  Image as ImageIcon,
  MapPin,
  FileText,
  MessageCircle,
  Mail,
  Save,
  Settings,
  Printer,
  LayoutTemplate,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../components/common/Button";

export function General() {
  const [activeTab, setActiveTab] = useState("generales");

  return (
    <main className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Configuración de Empresa
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Gestiona la identidad de tu taller y personaliza tus documentos.
          </p>
        </div>
        <Button className="flex gap-2 items-center bg-primary-500 hover:bg-primary-600 text-white border-none shadow-lg shadow-primary-500/20">
          <Save size={18} /> Guardar Cambios
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("generales")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "generales"
              ? "bg-white dark:bg-neutral-900 shadow-sm text-primary-600"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <Settings size={18} /> Datos Generales
        </button>
        <button
          onClick={() => setActiveTab("comprobantes")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "comprobantes"
              ? "bg-white dark:bg-neutral-900 shadow-sm text-primary-600"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <LayoutTemplate size={18} /> Comprobantes OT
        </button>
      </div>

      {/* Tab Content: GENERALES */}
      {activeTab === "generales" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2 duration-300">
          {/* Columna Izquierda: Logo */}
          <section className="lg:col-span-1 space-y-4">
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                <ImageIcon size={16} /> Logo del Taller
              </h2>
              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 relative group overflow-hidden">
                  <span className="text-neutral-400 group-hover:hidden transition-all">
                    Subir imagen
                  </span>
                  <div className="absolute inset-0 bg-primary-500/10 hidden group-hover:flex items-center justify-center cursor-pointer">
                    <Button variant="outline" size="sm">
                      Cambiar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 text-center">
                  Recomendado: PNG o JPG de 500x500px. Máximo 2MB.
                </p>
              </div>
            </div>
          </section>

          {/* Columna Derecha: Formulario */}
          <section className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-2">
                  <Building2 size={14} className="text-primary-500" /> Razón
                  Social
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="Ej: Taller Mecánico Los Primos S.A."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-2">
                  <FileText size={14} className="text-primary-500" /> Datos
                  Fiscales (CUIT/RUT/NIT)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="30-12345678-9"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-2">
                  <MapPin size={14} className="text-primary-500" /> Dirección
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="Calle Falsa 123, Ciudad"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-2">
                  <MessageCircle size={14} className="text-primary-500" />{" "}
                  WhatsApp
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="+54 9 11 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-2">
                  <Mail size={14} className="text-primary-500" /> E-Mail de
                  Contacto
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="contacto@taller.com"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab Content: COMPROBANTES OT */}
      {activeTab === "comprobantes" && (
        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Printer className="text-primary-500" /> Plantillas de Orden de
              Trabajo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 1, name: "Clásico Industrial", active: true },
                { id: 2, name: "Moderno Minimalista", active: false },
                { id: 3, name: "Ticket Térmico (80mm)", active: false },
              ].map((template) => (
                <div
                  key={template.id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                    template.active
                      ? "border-primary-500 bg-primary-50/5"
                      : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-300"
                  }`}
                >
                  <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <FileText
                      className="text-neutral-300 group-hover:scale-110 transition-transform"
                      size={48}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{template.name}</span>
                    {template.active && (
                      <CheckCircle2 className="text-primary-500" size={18} />
                    )}
                  </div>
                  {template.active && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-primary-500 text-[10px] text-white font-bold rounded-full uppercase">
                      Activo
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
              <h3 className="font-bold">
                Opciones Adicionales del Comprobante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-sm">
                    Mostrar QR de seguimiento online
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-sm">
                    Incluir términos y condiciones (Pie de página)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
