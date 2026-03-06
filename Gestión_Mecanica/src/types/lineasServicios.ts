/**
 * @file lineasServicios.ts
 * @description Tipos e interfaces para LineaServicio - Corresponde con LineaServicio.java
 * @version 1.0
 * @date 28/02/2026
 */

import { Orden } from "./orden";

/**
 * Interfaz para la LineaServicio
 * Corresponde exactamente con la entidad LineaServicio.java del backend
 */
export interface LineaServicio {
  id: number;
  descripcion: string;
  precio: number;
  ordenId: number;
  orden?: Orden; // Relación opcional con Orden
}

export interface CreateLineaServicioRequest {
  descripcion: string;
  precio: number;
  ordenId: number;
}

export interface UpdateLineaServicioRequest {
  descripcion?: string;
  precio?: number;
  ordenId?: number;
}
