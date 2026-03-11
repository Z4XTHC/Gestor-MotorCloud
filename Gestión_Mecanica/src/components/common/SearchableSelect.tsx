import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  /**
   * Si es true, cuando la búsqueda no coincide exactamente con ninguna opción
   * aparece un ítem "+ Usar \"[texto]\"" que permite guardar el valor libre.
   */
  creatable?: boolean;
}

export const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  className = "",
  required = false,
  disabled = false,
  creatable = false,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchLower),
    );
  }, [options, search]);

  /** Verdadero cuando el texto buscado no coincide exactamente con ninguna opción. */
  const canCreate =
    creatable &&
    search.trim().length > 0 &&
    !options.some(
      (opt) => opt.label.toLowerCase() === search.trim().toLowerCase(),
    );

  const selectedOption = options.find((opt) => opt.value === value);
  // Para valores creados (creatable): si no está en options pero hay value, mostrarlo directamente
  const displayLabel =
    selectedOption?.label ?? (creatable && value ? value : null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setDropdownPos({
              top: spaceBelow < 268 ? rect.top - 264 : rect.bottom + 4,
              left: rect.left,
              width: rect.width,
            });
          }
          setIsOpen(!isOpen);
        }}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text text-left flex items-center justify-between ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span
          className={`flex-1 truncate ${displayLabel ? "" : "text-gray-400 dark:text-neutral-400"}`}
        >
          {displayLabel ?? placeholder}
        </span>
        <div className="flex items-center gap-1 ml-2">
          {value && !required && !disabled && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 "
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
          }}
          className="bg-white dark:bg-dark-card border border-neutral-light dark:border-dark-bg rounded-lg shadow-lg max-h-64 overflow-hidden"
        >
          <div className="p-2 border-b border-neutral-light dark:border-dark-bg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-3 py-2 border border-neutral-light dark:border-dark-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 && !canCreate ? (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center ">
                No se encontraron resultados
              </div>
            ) : (
              <>
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors text-gray-900 dark:text-dark-text ${
                      value === option.value
                        ? "bg-primary-lighter dark:bg-dark-bg font-medium"
                        : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

                {canCreate && (
                  <button
                    type="button"
                    onClick={() => {
                      const custom = search.trim();
                      onChange(custom);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 text-primary dark:text-dark-primary hover:bg-primary-lighter dark:hover:bg-dark-bg transition-colors border-t border-neutral-light dark:border-dark-bg font-medium"
                  >
                    <span className="text-lg leading-none">+</span>
                    <span>
                      Usar{" "}
                      <span className="font-semibold">
                        &ldquo;{search.trim()}&rdquo;
                      </span>
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
