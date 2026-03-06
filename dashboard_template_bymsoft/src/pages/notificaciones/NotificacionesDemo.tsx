/**
 * Componente de demostración de estilos de notificaciones
 *
 * Este es el componente equivalente al original de Vue.js
 * Muestra diferentes estilos y posiciones de notificaciones
 * NO consume la API de notificaciones del backend
 */

import { useState } from "react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import {
  Bell,
  Heart,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

type SnackbarPosition = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};

const colors = ["purple", "info", "success", "warning", "error"] as const;

export const NotificacionesDemo = () => {
  const [snackbar, setSnackbar] = useState(false);
  const [color, setColor] = useState<(typeof colors)[number]>("info");
  const [position, setPosition] = useState<SnackbarPosition>({
    top: true,
  });

  const showSnackbar = (
    vertical?: "top" | "bottom",
    horizontal?: "left" | "right",
  ) => {
    setPosition({
      top: vertical === "top",
      bottom: vertical === "bottom",
      left: horizontal === "left",
      right: horizontal === "right",
    });

    setColor(colors[Math.floor(Math.random() * colors.length)]);
    setSnackbar(true);
  };

  const getPositionClasses = () => {
    const classes = ["fixed", "z-50", "m-4"];

    if (position.top) classes.push("top-0");
    if (position.bottom) classes.push("bottom-0");
    if (position.left) classes.push("left-0");
    if (position.right) classes.push("right-0");

    if (!position.left && !position.right)
      classes.push("left-1/2", "transform", "-translate-x-1/2");

    return classes.join(" ");
  };

  const getColorClasses = (colorName: string) => {
    const colorMap: Record<string, string> = {
      purple: "bg-purple-500",
      info: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };
    return colorMap[colorName] || colorMap.info;
  };

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-light text-gray-900 dark:text-dark-text mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
            Handcrafted by us with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Estilos de notificaciones */}
          <div>
            <h2 className="text-xl font-light mb-4">Notifications Style</h2>

            <div className="space-y-4">
              {/* Simple */}
              <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-700 dark:text-blue-300">
                  This is a plain notification
                </p>
              </div>

              {/* Con botón de cerrar */}
              <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded flex justify-between items-center">
                <p className="text-blue-700 dark:text-blue-300">
                  This is a notification with close button.
                </p>
                <button className="text-blue-700 dark:text-blue-300 hover:text-blue-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Con ícono y botón */}
              <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-700 dark:text-blue-300 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 dark:text-blue-300 flex-1">
                  This is a notification with close button and icon.
                </p>
                <button className="text-blue-700 dark:text-blue-300 hover:text-blue-900 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Multilinea */}
              <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-700 dark:text-blue-300 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 dark:text-blue-300 flex-1">
                  This is a notification with close button and icon and have
                  many lines. You can see that the icon and the close button are
                  always vertically aligned. This is a beautiful notification.
                  So you don't have to worry about the style.
                </p>
                <button className="text-blue-700 dark:text-blue-300 hover:text-blue-900 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Estados de notificaciones */}
          <div>
            <h2 className="text-xl font-light mb-4">Notification States</h2>

            <div className="space-y-4">
              {/* INFO */}
              <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 dark:text-blue-300 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 dark:text-blue-300 flex-1">
                  <strong>INFO</strong> - This is a regular notification made
                  with color="info"
                </p>
                <button className="text-blue-700 dark:text-blue-300 hover:text-blue-900 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SUCCESS */}
              <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-300 flex-shrink-0 mt-0.5" />
                <p className="text-green-700 dark:text-green-300 flex-1">
                  <strong>SUCCESS</strong> - This is a regular notification made
                  with color="success"
                </p>
                <button className="text-green-700 dark:text-green-300 hover:text-green-900 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* WARNING */}
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-700 dark:text-yellow-300 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-700 dark:text-yellow-300 flex-1">
                  <strong>WARNING</strong> - This is a regular notification made
                  with color="warning"
                </p>
                <button className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ERROR */}
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-700 dark:text-red-300 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300 flex-1">
                  <strong>DANGER</strong> - This is a regular notification made
                  with color="error"
                </p>
                <button className="text-red-700 dark:text-red-300 hover:text-red-900 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PRIMARY */}
              <div className="bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded flex items-start gap-3">
                <Bell className="w-5 h-5 text-purple-700 dark:text-purple-300 flex-shrink-0 mt-0.5" />
                <p className="text-purple-700 dark:text-purple-300 flex-1">
                  <strong>PRIMARY</strong> - This is a regular notification made
                  with color="purple"
                </p>
                <button className="text-purple-700 dark:text-purple-300 hover:text-purple-900 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posiciones de notificaciones */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-light mb-2">Notification Places</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click to view notifications
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Button
              variant="primary"
              onClick={() => showSnackbar("top", "left")}
            >
              Top Left
            </Button>
            <Button variant="primary" onClick={() => showSnackbar("top")}>
              Top Center
            </Button>
            <Button
              variant="primary"
              onClick={() => showSnackbar("top", "right")}
            >
              Top Right
            </Button>
            <Button
              variant="primary"
              onClick={() => showSnackbar("bottom", "left")}
            >
              Bottom Left
            </Button>
            <Button variant="primary" onClick={() => showSnackbar("bottom")}>
              Bottom Center
            </Button>
            <Button
              variant="primary"
              onClick={() => showSnackbar("bottom", "right")}
            >
              Bottom Right
            </Button>
          </div>
        </div>
      </Card>

      {/* Snackbar flotante */}
      {snackbar && (
        <div className={getPositionClasses()}>
          <div
            className={`${getColorClasses(color)} text-white p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}
          >
            <Bell className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm">
             Bienvenido a <strong>Motor Cloud</strong> - a beautiful
              freebie for every web developer.
            </p>
            <button
              onClick={() => setSnackbar(false)}
              className="hover:opacity-80 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
