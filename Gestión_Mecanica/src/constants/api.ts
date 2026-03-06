export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // �️ Image Proxy (CORS workaround)
  IMAGE_PROXY: (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`,

  // �🔐 Autenticación
  AUTH: {
    LOGIN: "/api/auth/login",
    VERIFY_USER: (id: string) => `/api/auth/verify/${id}`,
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: (id: string) => `/api/auth/reset-password/${id}`,
    UPDATE_PASSWORD: (id: string) => `/api/auth/update-password/${id}`,
    CHECK: "/api/auth/check",
    LOGOUT: "/api/auth/logout",
  },

  // 👥 Usuarios
  USERS: {
    LIST: "/api/usuarios/",
    CREATE: "/api/usuarios/guardar",
    GET: (id: string) => `/api/usuarios/detalles/${id}`,
    UPDATE: (id: string) => `/api/usuarios/actualizar/${id}`,
    DELETE: (id: string) => `/api/usuarios/${id}`,
  },

  // 🏢 Clientes
  CLIENTES: {
    LIST: "/api/clientes/",
    CREATE: "/api/clientes/guardar",
    GET: (id: string) => `/api/clientes/detalles/${id}`,
    UPDATE: (id: string) => `/api/clientes/actualizar/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/clientes/cambiar-estado/${id}`,
    DELETE: (id: string) => `/api/clientes/${id}`,
  },

  // 📋 Órdenes
  ORDENES: {
    LIST: "/api/ordenes/",
    CREATE: "/api/ordenes/guardar",
    GET: (id: string) => `/api/ordenes/detalles/${id}`,
    UPDATE: (id: string) => `/api/ordenes/actualizar/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/ordenes/cambiar-estado/${id}`,
  },

  // 🔔 Notificaciones
  NOTIFICACIONES: {
    LIST: "/api/notificaciones",
    MARCAR_LEIDA: (id: string) => `/api/notificaciones/${id}/leer`,
    MARCAR_TODAS_LEIDAS: "/api/notificaciones/leer-todas",
    DELETE: (id: string) => `/api/notificaciones/${id}`,
    COUNT_NO_LEIDAS: "/api/notificaciones/no-leidas/count",
  },

  // 🚗 Vehículos
  VEHICULOS: {
    LIST: "/api/vehiculos/",
    CREATE: "/api/vehiculos/guardar",
    GET: (id: string) => `/api/vehiculos/detalles/${id}`,
    UPDATE: (id: string) => `/api/vehiculos/actualizar/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/vehiculos/cambiar-estado/${id}`,
    DELETE: (id: string) => `/api/vehiculos/${id}`,
    BY_CLIENT: (clienteId: string) => `/api/vehiculos/porCliente/${clienteId}`,
  },

  // 👑 Admin
  ADMIN: {
    LIST_ALL_CLIENTS: "/api/admin",
    TOGGLE_USER_STATUS: (id: string) => `/api/admin/${id}`,
  },
} as const;

// ⚙️ Configuración
export const REQUEST_TIMEOUT = 120000; // 2 minutos para servidores lentos
export const MAX_RETRIES = 3;

// 📎 Tipos de archivos soportados
export const FILE_TYPES = {
  IMAGES: ["jpeg", "jpg", "png"],
  PDF: ["pdf"],
  EXCEL: ["xlsx", "xls"],
} as const;
