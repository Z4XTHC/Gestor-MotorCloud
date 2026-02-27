export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // �️ Image Proxy (CORS workaround)
  IMAGE_PROXY: (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`,

  // �🔐 Autenticación
  AUTH: {
    LOGIN: "/api/auth/signin",
    VERIFY_USER: (id: string) => `/api/auth/verify/${id}`,
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: (id: string) => `/api/auth/reset-password/${id}`,
    UPDATE_PASSWORD: (id: string) => `/api/auth/update-password/${id}`,
  },

  // 👥 Usuarios
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users",
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    RESEND_EMAIL: "/api/users/resend",
  },

  // 🏢 Clientes
  CLIENTES: {
    LIST: "/api/clientes",
    CREATE: "/api/clientes",
    GET: (id: string) => `/api/clientes/${id}`,
    UPDATE: (id: string) => `/api/clientes/${id}`,
    DELETE: (id: string) => `/api/clientes/${id}`,
    RESEND_ACTIVATION: "/api/clientes/resend",
    RESEND_ACTIVATION_MAIL: "/api/clientes/resend-activation-mail",
  },

  // 📋 Órdenes
  ORDENES: {
    LIST: "/api/ordenes", // Con sort automático
    CREATE: "/api/ordenes",
    GET: (id: string) => `/api/ordenes/${id}`,
    UPDATE: (id: string) => `/api/ordenes/${id}`,
    DELETE: (id: string) => `/api/ordenes/${id}`,
    BY_CLIENT: (clienteId: string) => `/api/ordenes/cliente/${clienteId}`,
    EXPORT_EXCEL: (clienteId: string) => `/api/ordenes/export/${clienteId}`,
    DASHBOARD_STATS: "/api/ordenes/dashboard-stats",
  },

  // 🔔 Notificaciones
  NOTIFICACIONES: {
    LIST: "/api/notificaciones",
    MARCAR_LEIDA: (id: string) => `/api/notificaciones/${id}/leer`,
    MARCAR_TODAS_LEIDAS: "/api/notificaciones/leer-todas",
    DELETE: (id: string) => `/api/notificaciones/${id}`,
    COUNT_NO_LEIDAS: "/api/notificaciones/no-leidas/count",
  },

  // 👑 Admin
  ADMIN: {
    LIST_ALL_CLIENTS: "/api/admin",
    TOGGLE_USER_STATUS: (id: string) => `/api/admin/${id}`,
  },

} as const;

// 📊 Query parameters comunes
export const QUERY_PARAMS = {
  EMPLEADOS: {
    SORT: {
      ASC: "asc",
      DESC: "desc",
    },
  },
  ORDENES: {
    FECHA_INICIO: {
      ASC: "asc",
      DESC: "desc",
    },
    FECHA_VENCIMIENTO: {
      ASC: "asc",
      DESC: "desc",
    },
  },
  CLIENTES: {
    FILTER_DOCS: "?filter=docs&doc=true",
  },
} as const;

// ⚙️ Configuración
export const REQUEST_TIMEOUT = 120000; // 2 minutos para servidores lentos
export const MAX_RETRIES = 3;

// 🎭 Roles del sistema
export const USER_ROLES = {
  ADMIN: "Admin",
  TECHNICIAN: "Tecnicos",
  CLIENT: "Clientes",
} as const;

// 📎 Tipos de archivos soportados
export const FILE_TYPES = {
  IMAGES: ["jpeg", "jpg", "png"],
  PDF: ["pdf"],
  EXCEL: ["xlsx", "xls"],
} as const;
