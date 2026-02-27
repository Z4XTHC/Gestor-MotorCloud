import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface WhatsAppModalProps {
  order: {
    id: string;
    vehicleInfo: {
      plate: string;
      model: string;
      client: string;
      phone: string;
    };
  };
  onClose: () => void;
}

export function WhatsAppModal({ order, onClose }: WhatsAppModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultMessage = `¡Hola ${order.vehicleInfo.client}! 🔧

Su vehículo ${order.vehicleInfo.model} (Patente: ${order.vehicleInfo.plate}) ya está listo para retirar.

📋 Orden de Trabajo: ${order.id}
✅ Trabajo completado y revisado

Puede pasar a retirarlo en nuestro horario de atención:
📅 Lunes a Viernes: 9:00 - 18:00
📅 Sábados: 9:00 - 13:00

¡Gracias por confiar en MTS Competición! 🏁`;

  const handleSendWhatsApp = async () => {
    setIsLoading(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Aquí se integraría con la API de WhatsApp Business
    alert(`✅ Mensaje enviado exitosamente a ${order.vehicleInfo.client} (${order.vehicleInfo.phone})`);
    
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-strong">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Notificar por WhatsApp
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {order.vehicleInfo.client} - {order.vehicleInfo.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Mensaje de WhatsApp:
            </label>
            <div className="relative">
              <textarea
                rows={12}
                value={defaultMessage}
                readOnly
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              El mensaje se enviará automáticamente al número registrado del cliente
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSendWhatsApp}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg font-medium hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar WhatsApp
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}