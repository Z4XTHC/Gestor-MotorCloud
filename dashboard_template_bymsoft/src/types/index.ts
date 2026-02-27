export interface User {
  _id?: string;
  id?: string;
  email: string;
  admin?: boolean;
  cliente_id?: string | null;
  tecnico_id?: string | null;
  status?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Campos calculados para compatibilidad
  name?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface Cliente {
  _id?: string;
  id?: string;
  nombreFantasia: string;
  razonSocial: string;
  cuit: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  pais_id?: string; // ID del país cuando no viene poblado
  rubro?: {
    _id: string;
    nombre: string;
  };
  rubro_id?: string; // ID del rubro cuando no viene poblado
  categoriaAfip?: {
    _id: string;
    nombre: string;
  };
  categoriaAfip_id?: string; // ID de la categoría AFIP cuando no viene poblada
  image?: string;
  linktofile?: string;
  active?: boolean; // Campo para filtrar (true/false)
  activo?: boolean; // Alias de active
  status?: string; // Campo de texto ("Activado" / "Sin activar")
  sucursales?: any[]; // Array de sucursales
  createdAt?: string;
  updatedAt?: string;
}

export interface Sucursal {
  _id?: string;
  id?: string;
  cliente_id?: string;
  clienteId?: string;
  cliente?: Cliente;
  nombre?: string;
  identificacion?: string;
  direccion: string;
  ciudad?: string;
  provincia?: string;
  localidad_id?: string;
  localidad?: {
    _id: string;
    nombre: string;
  };
  telefono?: string;
  email?: string;
  secondEmail?: string;
  responsable?: string;
  latitud?: string;
  longitud?: string;
  cantidad_ordenes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TipoOrden {
  _id: string;
  nombre: string;
  capacitacion?: boolean;
  descripcion?: string;
}

export interface Orden {
  _id?: string;
  id?: string;
  numeroorden: string;
  sucursal?: Sucursal;
  cliente?: Cliente;
  tipoOrden?: TipoOrden;
  fechavencimiento: string;
  fechainicio?: string;
  capacitacion?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdenServicio {
  id: string;
  numero: string;
  clienteId: string;
  clienteNombre: string;
  sucursalId: string;
  sucursalNombre: string;
  tipoOrden: string;
  estado: "Pendiente" | "En Proceso" | "Completada" | "Cancelada";
  fechaCreacion: string;
  fechaInicio?: string;
  fechaFin?: string;
  tecnicos: string[];
  descripcion: string;
  observaciones?: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  cuit: string;
  email: string;
  telefono: string;
  cargo: string;
  sucursalId: string;
  sucursalNombre: string;
  fechaIngreso: string;
  activo: boolean;
}

export interface Capacitacion {
  id: string;
  ordenId: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  duracion: number;
  instructor: string;
  asistentes: string[];
  documentos: string[];
  estado: "Programada" | "Completada" | "Cancelada";
}

// Documento puede ser de dos tipos:
// 1. Documento CREADO (template): tiene nombre, etiqueta, file
// 2. Documento ASIGNADO: tiene cliente_id, file
export interface Documento {
  _id: string;
  file: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;

  // Para documentos CREADOS (templates)
  nombre?: string;
  etiqueta?: string;

  // Para documentos ASIGNADOS a clientes
  cliente_id?: string;
}

export interface Notificacion {
  _id?: string;
  id?: string;
  user_id?: string;
  textoDescriptivo: string;
  leida: boolean;
  tipo?: "info" | "warning" | "error" | "success";
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalOrdenes: number;
  ordenesPendientes: number;
  ordenesEnProceso: number;
  ordenesCompletadas: number;
  totalClientes: number;
  totalEmpleados: number;
  capacitacionesMes: number;
  alertas: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface Provincia {
  _id: string;
  nombre: string;
  pais_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Localidad {
  _id: string;
  nombre: string;
  provincia_id?: string;
  provincia?: Provincia;
  codigoPostal?: string;
  pais_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ThemeMode = "light" | "dark";
export type ScaleSize = "small" | "normal" | "large";
