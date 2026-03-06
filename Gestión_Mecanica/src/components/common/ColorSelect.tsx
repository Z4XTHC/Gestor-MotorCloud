import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { COLORES_VEHICULO } from "./coloresVehiculo";

export interface ColorOption {
  value: string;
  label: string;
  /** Cualquier valor CSS válido (hex, rgb, nombre…). Si no se provee se muestra patrón neutro. */
  hex?: string;
}

interface ColorSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: ColorOption[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Indicador circular con el color del ítem. */
const Swatch = ({ hex }: { hex?: string }) => (
  <span
    className="inline-block w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-600 shrink-0"
    style={
      hex
        ? { background: hex }
        : {
            background:
              "linear-gradient(135deg,#ccc 25%,#fff 25%,#fff 50%,#ccc 50%,#ccc 75%,#fff 75%)",
          }
    }
  />
);

export const ColorSelect = ({
  value,
  onChange,
  options = COLORES_VEHICULO,
  placeholder = "Seleccionar color...",
  className = "",
  required = false,
  disabled = false,
}: ColorSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const s = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(s));
  }, [options, search]);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text text-left flex items-center justify-between gap-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className="flex items-center gap-2 flex-1 min-w-0">
          <Swatch hex={selectedOption?.hex} />
          <span className={`truncate ${selectedOption ? "" : "text-gray-400"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && !required && !disabled && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-card border border-neutral-light dark:border-dark-bg rounded-lg shadow-lg max-h-72 overflow-hidden">
          {/* Búsqueda */}
          <div className="p-2 border-b border-neutral-light dark:border-dark-bg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar color..."
              className="w-full px-3 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text text-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Opciones */}
          <div className="overflow-y-auto max-h-56">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center text-sm">
                No se encontraron resultados
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors text-gray-900 dark:text-dark-text text-sm ${
                    value === option.value
                      ? "bg-primary-lighter dark:bg-dark-bg font-medium"
                      : ""
                  }`}
                >
                  <Swatch hex={option.hex} />
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
