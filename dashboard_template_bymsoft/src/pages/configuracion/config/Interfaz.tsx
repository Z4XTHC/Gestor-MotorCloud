import React, { useState, useEffect } from "react";
import { Card } from "../../../components/common/Card";
import { Button } from "../../../components/common/Button";
import { showSuccess, showError } from "../../../components/common/SweetAlert";
import { Palette, Check, RotateCcw } from "lucide-react";

// Colores disponibles para el Base
const baseColors = [
  { name: "Rojo Principal", value: "#940000", tailwind: "red-800" },
  { name: "Azul Marino", value: "#1e3a8a", tailwind: "blue-900" },
  { name: "Verde Oscuro", value: "#14532d", tailwind: "green-900" },
  { name: "Púrpura", value: "#581c87", tailwind: "purple-900" },
  { name: "Naranja", value: "#ea580c", tailwind: "orange-600" },
  { name: "Rosa", value: "#be185d", tailwind: "pink-700" },
  { name: "Índigo", value: "#312e81", tailwind: "indigo-800" },
  { name: "Teal", value: "#0f766e", tailwind: "teal-700" },
];

export const Interfaz: React.FC = () => {
  const [selectedBase, setSelectedBase] = useState("#940000");
  const [savedBase, setSavedBase] = useState("#940000");

  useEffect(() => {
    // Cargar configuración guardada
    const saved = localStorage.getItem("dashboard-base-color");
    if (saved) {
      setSelectedBase(saved);
      setSavedBase(saved);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("dashboard-base-color", selectedBase);
      setSavedBase(selectedBase);
      showSuccess(
        "Configuración guardada",
        "Los colores han sido actualizados correctamente.",
      );
    } catch (error) {
      showError("Error", "No se pudo guardar la configuración.");
    }
  };

  const handleReset = () => {
    const defaultColor = "#940000";
    setSelectedBase(defaultColor);
    localStorage.setItem("dashboard-base-color", defaultColor);
    setSavedBase(defaultColor);
    showSuccess(
      "Configuración restablecida",
      "Se ha restaurado el color por defecto.",
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
          Configuración de Interfaz
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personaliza los colores y apariencia del dashboard
        </p>
      </div>

      <Card title="Color Base" className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Selecciona el color base que se utilizará en botones, enlaces y
              elementos destacados del dashboard.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {baseColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedBase(color.value)}
                  className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedBase === color.value
                      ? "border-gray-900 dark:border-white shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedBase === color.value && (
                    <Check className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow-lg" />
                  )}
                  <div className="text-white text-sm font-medium drop-shadow-lg">
                    {color.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
              Vista Previa
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Base Seleccionado:
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: selectedBase }}
                  ></div>
                  <div>
                    <p className="font-mono text-sm">{selectedBase}</p>
                    <p className="text-xs text-gray-500">Base</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Ejemplo de uso:
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    style={{ backgroundColor: selectedBase }}
                  >
                    Botón Primary
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      borderColor: selectedBase,
                      color: selectedBase,
                    }}
                  >
                    Botón Outline
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex gap-3">
            <Button variant="primary" onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
          </div>

          {savedBase !== selectedBase && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Nota:</strong> Tienes cambios sin guardar. Haz clic en
                "Guardar Cambios" para aplicar la nueva configuración.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Información Técnica" className="p-6">
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Color Base:</strong> Se utiliza para botones principales,
            enlaces activos y elementos de navegación.
          </p>
          <p>
            <strong>Nota:</strong> Los cambios se aplican inmediatamente en esta
            página de configuración, pero pueden requerir recargar otras páginas
            para ver los efectos completos.
          </p>
        </div>
      </Card>
    </div>
  );
};
