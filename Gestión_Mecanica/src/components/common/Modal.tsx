import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Ícono opcional que aparece a la izquierda del título en el header */
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  /** Elimina el padding del cuerpo del modal para que el contenido maneje su propio espaciado */
  noPadding?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

/**
 * Modal - Componente modal reutilizable para MangoSoft.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Mi Modal"
 *   footer={<Button onClick={handleSave}>Guardar</Button>}
 * >
 *   <p>Contenido del modal</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = "2xl",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  noPadding = false,
}) => {
  // Manejar cierre con tecla Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`bg-white dark:bg-neutral-800 rounded-xl shadow-strong ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  {icon}
                </div>
              )}
              {title && (
                <h3
                  id="modal-title"
                  className="text-lg font-semibold text-neutral-900 dark:text-white"
                >
                  {title}
                </h3>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`flex-1 overflow-y-auto${noPadding ? "" : " p-6"}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
