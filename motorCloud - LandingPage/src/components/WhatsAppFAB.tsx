import { MessageCircle } from 'lucide-react';
import { enterpriseData } from '../data/enterpriseData';

export const WhatsAppFAB = () => {
  return (
    <a
      href={`https://wa.me/${enterpriseData.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-neutral-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Necesitás ayuda?
      </span>
    </a>
  );
};
