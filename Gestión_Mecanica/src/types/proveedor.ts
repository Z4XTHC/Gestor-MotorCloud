/**
 * @file proveedor.ts
 * @description Tipos e interfaces para Proveedor - Corresponde con Proveedor.java
 * @version 1.0
 * @date 9/03/2026
 */

/**
 * Interfaz para el Proveedor
 * Corresponde exactamente con la entidad Proveedor.java del backend
 */

export interface Proveedor {
  id: number;
  razonSocial: string;
  cuit: string;
  telefono: string;
  email: string;
  direccion: string;
  status: boolean;
}

export interface CreateProveedorRequest {
  razonSocial: string;
  cuit: string;
  telefono: string;
  email: string;
  direccion: string;
  status?: boolean;
}

export interface UpdateProveedorRequest {
  razonSocial?: string;
  cuit?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  status?: boolean;
}
