import { X, Calendar, Bell, BellOff, Trash2 } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Notificacion } from "../../types";
import { useEffect } from "react";
import DetallesModal from "../../components/common/DetallesModal";

interface NotificacionesDetallesProps {
  notificacion: Notificacion;
  onClose: () => void;
  onToggleLeida: () => void;
  onDelete: () => void;
}

/**
 * Componente modal de visualización de detalles de notificación
 *
 * Muestra información completa de una notificación en modo solo lectura:
 * - Texto descriptivo completo
 * - Tipo de notificación con badge de color
 * - Estado (leída/no leída)
 * - Fecha de creación
 * - Última actualización
 * - Acciones: Marcar leída/no leída, Eliminar
 *
 * Características:
 * - Modal centrado con overlay
 * - Cierre con ESC o click fuera
 * - Botones de acción inline
 * - Diseño responsivo
 * - Formateo de fechas localizado
 *
 * @param {NotificacionesDetallesProps} props - Propiedades del componente
 * @param {Notificacion} props.notificacion - Notificación a mostrar
 * @param {() => void} props.onClose - Callback al cerrar modal
 * @param {() => void} props.onToggleLeida - Callback para marcar/desmarcar como leída
 * @param {() => void} props.onDelete - Callback para eliminar notificación
 * @returns {JSX.Element} Modal de detalles de notificación
 */
export const NotificacionesDetalles = ({
  notificacion,
  onClose,
  onToggleLeida,
  onDelete,
}: NotificacionesDetallesProps) => {
  /**
   * Formatea una fecha ISO a formato local legible
   *
   * @param {string | undefined} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada o "-"
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Retorna el badge de tipo de notificación
   *
   * @param {string} tipo - Tipo de notificación
   * @returns {JSX.Element} Badge con color y texto
   */
  const getTipoBadge = (tipo?: string) => {
    const tipos: Record<string, { label: string; className: string }> = {
      info: {
        label: "Información",
        className:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      },
      success: {
        label: "Éxito",
        className:
          "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      },
      warning: {
        label: "Advertencia",
        className:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
      },
      error: {
        label: "Error",
        className:
          "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      },
    };

    const tipoData = tipos[tipo || "info"];

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${tipoData.className}`}
      >
        {tipoData.label}
      </span>
    );
  };

  /**
   * Maneja el cierre del modal con la tecla ESC
   */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const headerContent = (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
        Detalles de Notificación
      </h2>
      <div className="flex items-center gap-3 mt-2">
        {getTipoBadge(notificacion.tipo)}
        {notificacion.leida ? (
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <BellOff className="w-4 h-4" />
            Leída
          </span>
        ) : (
          <span className="text-sm text-primary dark:text-dark-primary font-semibold flex items-center gap-1">
            <Bell className="w-4 h-4" />
            No leída
          </span>
        )}
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-between gap-3 w-full">
      <Button
        variant="secondary"
        icon={<Trash2 className="w-5 h-5" />}
        onClick={onDelete}
      >
        Eliminar
      </Button>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          icon={
            notificacion.leida ? (
              <BellOff className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )
          }
          onClick={onToggleLeida}
        >
          {notificacion.leida ? "Marcar como no leída" : "Marcar como leída"}
        </Button>
      </div>
    </div>
  );

  return (
    <DetallesModal
      headerContent={headerContent}
      footer={footer}
      onClose={onClose}
      maxWidthClass="max-w-2xl"
    >
      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Mensaje
            </label>
            <p className="text-gray-900 dark:text-dark-text text-lg leading-relaxed">
              {notificacion.textoDescriptivo}
            </p>
          </div>

          {notificacion.link && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Enlace relacionado
              </label>
              <a
                href={notificacion.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary dark:text-dark-primary hover:underline break-all"
              >
                {notificacion.link}
              </a>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Información del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificacion.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-gray-900 dark:text-dark-text text-sm">
                    {formatDate(notificacion.createdAt)}
                  </p>
                </div>
              )}
              {notificacion.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Última Actualización
                  </label>
                  <p className="text-gray-900 dark:text-dark-text text-sm">
                    {formatDate(notificacion.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </DetallesModal>
  );
};
