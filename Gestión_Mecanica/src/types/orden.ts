/**
 * @file orden.ts
 * @description Tipos alineados con Orden.java, LineaServicio.java del backend.
 */

/** Línea de servicio tal como la devuelve el backend en GET /api/ordenes/ */
export interface LineaServicioResponse {
  id?: number;
  descripcion: string;
  precio: number;
}

/** Vehículo anidado en la respuesta de Orden */
export interface OrdenVehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  patente: string;
  cliente?: {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
  };
}

/** Usuario/técnico anidado en la respuesta de Orden */
export interface OrdenUsuario {
  id: number;
  nombre: string;
  apellido: string;
}

/** Orden tal como la devuelve GET /api/ordenes/ */
export interface Orden {
  id: number;
  numeroOrden: string;
  fechaCreacion: string; // "YYYY-MM-DD"
  fechaEntrega: string; // "YYYY-MM-DD"
  descripcion: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";
  total: number | null;
  vehiculo: OrdenVehiculo;
  usuario: OrdenUsuario;
  lineasServicio: LineaServicioResponse[];
  status: boolean;
}

/** Payload para POST /api/ordenes/guardar */
export interface CreateOrdenPayload {
  numeroOrden: string;
  fechaCreacion: string;
  fechaEntrega: string;
  descripcion: string;
  estado: string;
  vehiculo: { id: number };
  usuario: { id: number };
  status: boolean;
  lineasServicio: { descripcion: string; precio: number }[];
}

// Alias para compatibilidad con importaciones existentes
export type CrearOrdenPayload = CreateOrdenPayload;
export type ActualizarOrdenPayload = Partial<CreateOrdenPayload>;
