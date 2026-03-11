export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // 🏢 Datos de la Empresa
  EMPRESA: {
    GET: "/api/empresa", // Siempre devuelve el registro con ID 1
  },

  // Obtener datos de OT
  ORDENES: {
    GET: (numeroOrden: string) => `/api/ordenes/seguimiento/${numeroOrden}`, // Lista todas las OT
  },
} as const;
