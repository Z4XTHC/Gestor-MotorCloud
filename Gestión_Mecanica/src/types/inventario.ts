/**
 * @file inventario.ts
 * @description Tipos e interfaces para Inventario - Corresponde con Inventario.java
 * @version 1.0
 * @date 09/03/2026
 */

/**
 * Interfaz para el Inventario
 * Corresponde exactamente con la entidad Inventario.java del backend
 */

export interface Inventario {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  costo: number;
  status: boolean;
}

export interface CreateInventarioRequest {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  costo: number;
  status?: boolean;
}

export interface UpdateInventarioRequest {
  nombre?: string;
  descripcion?: string;
  stock?: number;
  precio?: number;
  costo?: number;
  status?: boolean;
}
