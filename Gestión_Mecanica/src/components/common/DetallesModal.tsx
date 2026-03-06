import React, { useEffect } from "react";

interface DetallesModalProps {
  title?: string;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  maxWidthClass?: string;
  contentClassName?: string;
  footerClassName?: string;
}

/**
 * DetallesModal - Componente base para modales en MangoSoft.
 * Incluye soporte para cierre por teclado (Esc) y accesibilidad básica.
 */
const DetallesModal = ({
  title,
  headerContent,
  children,
  footer,
  onClose,
  maxWidthClass = "max-w-2xl",
  contentClassName = "p-6",
  footerClassName = "p-6 border-t border-neutral-light dark:border-dark-bg flex justify-end gap-2",
}: DetallesModalProps) => {
  // Accesibilidad: Cerrar con tecla Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose} // Cierra al hacer clic en el backdrop
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`bg-white dark:bg-dark-surface rounded-2xl shadow-xl ${maxWidthClass} w-full max-h-[90vh] overflow-y-auto flex flex-col`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-light dark:border-dark-bg flex items-start justify-between gap-4">
          <div className="flex-1">
            {headerContent
              ? headerContent
              : title && (
                  <h2
                    id="modal-title"
                    className="text-2xl font-bold text-gray-900 dark:text-dark-text"
                  >
                    {title}
                  </h2>
                )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={`flex-1 ${contentClassName}`}>{children}</div>

        {/* Footer */}
        {footer && <div className={footerClassName}>{footer}</div>}
      </div>
    </div>
  );
};

export default DetallesModal;
