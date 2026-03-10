import React, { useState } from "react";
import {
  Check,
  X,
  Zap,
  ShieldCheck,
  Calendar,
  ArrowUpCircle,
  Clock,
  KeyRound,
  Plus,
} from "lucide-react";
import { Button } from "../../../components/common/Button";

export function Licencia() {
  // Estado para el modal de nueva licencia (puedes integrarlo con tu componente Modal)
  const [showLicenceModal, setShowLicenceModal] = useState(false);

  const planes = [
    {
      id: "standard",
      nombre: "Standard",
      precio: "$30.000",
      actual: true,
      features: {
        gestion: true,
        ot: true,
        dashboard: true,
        impresion: true,
        inventario: false,
        rentabilidad: false,
        facturacion: false,
        pasarela: false,
        landing: false,
      },
    },
    {
      id: "intermedio",
      nombre: "Intermedio",
      precio: "$45.000",
      popular: true,
      features: {
        gestion: true,
        ot: true,
        dashboard: true,
        impresion: true,
        inventario: true,
        rentabilidad: true,
        facturacion: false,
        pasarela: false,
        landing: false,
      },
    },
    {
      id: "premium",
      nombre: "Premium (Plus)",
      precio: "$65.000",
      features: {
        gestion: true,
        ot: true,
        dashboard: true,
        impresion: true,
        inventario: true,
        rentabilidad: true,
        facturacion: true,
        pasarela: true,
        landing: true,
      },
    },
  ];

  const filasComparativas = [
    { key: "gestion", label: "Gestión Clientes y Vehículos" },
    { key: "ot", label: "Órdenes de Trabajo (OT)" },
    { key: "dashboard", label: "Dashboard y Reportes Básicos" },
    { key: "impresion", label: "Impresión de Comprobantes" },
    { key: "inventario", label: "Inventario (Stock de Repuestos)" },
    { key: "rentabilidad", label: "Reportes de Rentabilidad" },
    { key: "facturacion", label: "Facturación Electrónica" },
    { key: "pasarela", label: "Pasarela de Pago (Mercado Pago)" },
    { key: "landing", label: "Landing Page + Consulta Online" },
  ];

  const planActual = planes.find((p) => p.actual);

  return (
    <main className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
            Planes y Suscripción
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Gestiona tu suscripción y activa nuevos módulos para tu taller.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl">
          <ShieldCheck className="text-success-600" size={20} />
          <span className="text-sm font-bold text-success-700 dark:text-success-400">
            Suscripción Verificada
          </span>
        </div>
      </div>

      {/* Grid de Estado y Gestión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-neutral-400">
            <Clock size={20} />
            <h2 className="text-xs font-bold uppercase tracking-widest">
              Estado del Plan
            </h2>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {planActual?.nombre}
            </p>
            <p className="text-sm text-neutral-500 italic">
              Licencia de uso activo
            </p>
          </div>
        </section>

        <section className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-neutral-400">
            <Calendar size={20} />
            <h2 className="text-xs font-bold uppercase tracking-widest">
              Vencimiento
            </h2>
          </div>
          <div>
            <p className="text-2xl font-bold">15 Abr, 2024</p>
            <p className="text-sm text-neutral-500">
              Renovación automática: No
            </p>
          </div>
        </section>

        <section className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-neutral-400">
            <KeyRound size={20} />
            <h2 className="text-xs font-bold uppercase tracking-widest">
              Administrar Licencia
            </h2>
          </div>
          <Button
            onClick={() => setShowLicenceModal(true)}
            className="w-full justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <Plus size={16} /> Agregar Licencia
          </Button>
        </section>
      </div>

      {/* Tabla Comparativa Dinámica */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ArrowUpCircle className="text-primary-500" /> Comparativa de Módulos
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
          <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                <th className="w-1/3 p-6 text-sm font-bold text-neutral-500 uppercase border-b border-neutral-200 dark:border-neutral-800">
                  Características
                </th>
                {planes.map((plan) => (
                  <th
                    key={plan.id}
                    className={`p-6 border-b border-neutral-200 dark:border-neutral-800 ${plan.popular ? "bg-primary-50/30 dark:bg-primary-950/10" : ""}`}
                  >
                    <div className="flex flex-col h-24 justify-end items-center text-center">
                      {plan.popular && (
                        <span className="px-2 py-0.5 bg-primary-500 text-[10px] text-white font-bold rounded-full mb-auto uppercase tracking-tighter">
                          Popular
                        </span>
                      )}
                      <span
                        className={`block text-lg font-black ${plan.popular ? "text-primary-600" : ""}`}
                      >
                        {plan.nombre}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        {plan.precio} / mes
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filasComparativas.map((fila) => (
                <tr
                  key={fila.key}
                  className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="p-5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {fila.label}
                  </td>
                  {planes.map((plan) => (
                    <td
                      key={`${plan.id}-${fila.key}`}
                      className={`p-5 text-center ${plan.popular ? "bg-primary-50/5 dark:bg-primary-950/5" : ""}`}
                    >
                      {plan.features[fila.key as keyof typeof plan.features] ? (
                        <Check
                          className={`mx-auto ${plan.popular ? "text-primary-500" : "text-success-500"}`}
                          size={20}
                          strokeWidth={plan.popular ? 3 : 2}
                        />
                      ) : (
                        <X
                          className="mx-auto text-neutral-300 dark:text-neutral-700"
                          size={20}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-6"></td>
                {planes.map((plan) => (
                  <td
                    key={`footer-${plan.id}`}
                    className={`p-6 text-center ${plan.popular ? "bg-primary-50/30 dark:bg-primary-950/10" : ""}`}
                  >
                    {plan.actual ? (
                      <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800">
                        <span className="text-xs font-black text-success-700 dark:text-success-400 uppercase tracking-widest">
                          Plan Actual
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant={plan.popular ? "primary" : "outline"}
                        className={`w-full font-bold shadow-sm ${plan.popular ? "bg-primary-500 hover:bg-primary-600 text-white border-none" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                      >
                        Seleccionar
                      </Button>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Footer Info */}
      <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-xl">
        <Zap className="text-primary-500" size={20} />
        <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
          ¿Deseas escalar a una solución corporativa?{" "}
          <button className="font-bold underline ml-1 hover:text-primary-800">
            Hablar con un asesor
          </button>
        </p>
      </div>
    </main>
  );
}
