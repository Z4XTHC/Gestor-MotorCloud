import { useEffect, useState } from "react";
import { X, Download, Smartphone, Monitor } from "lucide-react";
import { Card } from "./common/Card";
import { Button } from "./common/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptProps {
  variant?: "modal" | "banner";
  delay?: number;
}

export const InstallPrompt = ({
  variant = "modal",
  delay = 5000,
}: InstallPromptProps) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    // Verificar si la app ya está instalada (múltiples métodos)
    const checkIfInstalled = () => {
      // Método 1: Verificar display-mode standalone
      if (window.matchMedia("(display-mode: standalone)").matches) {
        return true;
      }

      // Método 2: iOS Safari standalone mode
      if ((window.navigator as any).standalone === true) {
        return true;
      }

      // Método 3: localStorage flag
      if (localStorage.getItem("pwa-installed") === "true") {
        return true;
      }

      return false;
    };

    // Si ya está instalada, no mostrar nada
    if (checkIfInstalled()) {
      localStorage.setItem("pwa-installed", "true");
      return;
    }

    // Verificar si fue rechazado recientemente
    const isDismissed = localStorage.getItem("pwa-dismissed") === "true";
    const dismissedDate = localStorage.getItem("pwa-dismissed-date");

    // Si fue rechazado hace menos de 7 días, no mostrar
    if (isDismissed && dismissedDate) {
      const daysSinceDismissed =
        (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    // Detectar el evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostrar el prompt después del delay especificado
      setTimeout(() => setShowPrompt(true), delay);
    };

    // Detectar cuando se instala la app
    const handleAppInstalled = () => {
      localStorage.setItem("pwa-installed", "true");
      setShowPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [delay]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      localStorage.setItem("pwa-installed", "true");
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-dismissed", "true");
    localStorage.setItem("pwa-dismissed-date", Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) return null;

  // Renderizar como Modal Centrado
  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="max-w-md w-full animate-scale-in">
          <Card className="shadow-2xl border-2 border-primary dark:border-dark-primary">
            <div className="p-6">
              {/* Header con icono grande */}
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-primary to-primary-dark dark:from-dark-primary dark:to-primary rounded-2xl shadow-lg">
                  {isMobile ? (
                    <Smartphone className="w-12 h-12 text-white" />
                  ) : (
                    <Monitor className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>

              {/* Título y descripción */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
                  Instalar MangoSoft
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accede más rápido desde tu{" "}
                  {isMobile ? "dispositivo móvil" : "escritorio"}
                </p>
              </div>

              {/* Beneficios */}
              <div className="bg-warm-light dark:bg-dark-surface rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" />
                    Acceso directo desde tu pantalla de inicio
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" />
                    Funciona sin conexión a internet
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" />
                    Experiencia similar a una app nativa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" />
                    Sin ocupar espacio adicional
                  </li>
                </ul>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <Button
                  onClick={handleInstall}
                  variant="primary"
                  icon={<Download className="w-5 h-5" />}
                  className="flex-1"
                >
                  Instalar Ahora
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1"
                >
                  Más Tarde
                </Button>
              </div>

              {/* Cerrar */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar como Banner Superior
  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-primary via-primary-dark to-primary dark:from-dark-primary dark:via-primary dark:to-dark-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Icono y mensaje */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {isMobile ? (
                  <Smartphone className="w-6 h-6 text-white" />
                ) : (
                  <Monitor className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm md:text-base">
                  Instala MangoSoft en tu{" "}
                  {isMobile ? "dispositivo" : "escritorio"}
                </p>
                <p className="text-white/90 text-xs md:text-sm hidden sm:block">
                  Acceso rápido, notificaciones instantáneas y funciona sin
                  conexión
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="bg-white text-primary dark:text-dark-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Instalar</span>
              </button>
              <button
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
