/**
 * @file AcercaDe.tsx
 * @description Página con información de la aplicación template.
 * @version 1.0
 * @date 04/02/2026
 * @author Template
 * @license MIT
 */
import { Card } from "../components/common/Card";
import {
  Info,
  Users,
  Wrench,
  Sparkles,
  GitBranch,
  ExternalLink,
  Mail,
} from "lucide-react";

const versionHistory = [
  {
    version: "1.0",
    date: "04/02/2026",
    features: ["Template de Dashboard inicial."],
    fixes: [],
  },
];

export const AcercaDe = () => {
  const currentVersion = versionHistory[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-28 w-28 rounded-full shadow-lg bg-blue-500 flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-dark-text mb-2">
          Acerca del Template
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Dashboard Template Genérico
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Versión actual:{" "}
          <span className="font-bold text-primary dark:text-dark-primary">
            {currentVersion.version}
          </span>
        </p>
      </div>

      {/* Sobre la Aplicación */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 dark:bg-dark-primary/10 rounded-lg">
            <Info className="w-6 h-6 text-primary dark:text-dark-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-3">
              Sobre la Aplicación
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>MangoSoft Dashboard</strong> es un template de dashboard
              para futuros proyectos.
            </p>
          </div>
        </div>
      </Card>

      {/* Créditos */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/10 dark:bg-secondary/10 rounded-lg">
            <Users className="w-6 h-6 text-secondary dark:text-secondary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
              Créditos
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-3">
                  <img
                    src="https://mangosofts.netlify.app/public/favicon.png"
                    alt="MangoSoft"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                  MangoSoft
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Desarrollador e integrador de MangoSoft. Especializado en
                  soluciones SaaS y automatización de procesos.
                </p>
                <a
                  href="https://mangosofts.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary dark:text-dark-primary hover:underline flex items-center gap-1"
                >
                  Visitar Sitio Web <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Historial de Versiones */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 dark:bg-dark-primary/10 rounded-lg">
            <GitBranch className="w-6 h-6 text-primary dark:text-dark-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
              Historial de Versiones
            </h2>
            <div className="space-y-6">
              {versionHistory.map((versionData) => (
                <div
                  key={versionData.version}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                >
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="bg-primary dark:bg-dark-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                      {versionData.version}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {versionData.date}
                    </p>
                  </div>
                  <div className="pl-4 space-y-4">
                    {versionData.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-dark-text flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-accent" />
                          Nuevas Funcionalidades
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {versionData.features.map((feat, i) => (
                            <li key={i}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {versionData.fixes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-dark-text flex items-center gap-2 mb-2">
                          <Wrench size={16} className="text-coral" />
                          Correcciones y Mejoras
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {versionData.fixes.map((fix, i) => (
                            <li key={i}>{fix}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Contacto y Soporte */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 dark:bg-dark-primary/10 rounded-lg">
            <Mail className="w-6 h-6 text-primary dark:text-dark-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
              Contacto y Soporte
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Email de soporte:</strong>{" "}
                <a
                  href="mailto:msoft.info.soporte@gmail.com"
                  className="text-primary dark:text-dark-primary hover:underline"
                >
                  msoft.info.soporte@gmail.com
                </a>
              </p>
              <p>
                <strong>Sitio web:</strong>{" "}
                <a
                  href="https://mangosofts.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary dark:text-dark-primary hover:underline"
                >
                  MangoSoft Web
                </a>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 MangoSoft - Dashboard Template
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Todos los derechos reservados
          </p>
        </div>
      </Card>
    </div>
  );
};
