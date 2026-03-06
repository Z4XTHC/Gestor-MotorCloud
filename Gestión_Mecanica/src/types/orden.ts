/**
 * @file Ordenes.ts
 * @description Tipos e interfaces para Ordenes - Corresponde con Ordenes.java
 * @version 1.0
 * @date 28/02/2026
 */

import { LineaServicio } from "./lineasServicios";

/**
 * Interfaz para la Orden
 * Corresponde exactamente con la entidad Ordenes.java del backend
 */

export interface Orden {
  id: number;
  numeroOrden: string;
  fechaIngreso: string; // ISO 8601
  fechaEntrega: string; // ISO 8601
  descripcion: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";
  clienteId: number;
  vehiculoId: number;
  mecanicoId: number;
  status: boolean;
  lineaServicios: LineaServicio[];
}

export interface CreateOrdenRequest {
  numeroOrden: string;
  fechaIngreso: string; // ISO 8601
  fechaEntrega: string; // ISO 8601
  descripcion: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";
  clienteId: number;
  vehiculoId: number;
  mecanicoId: number;
  status?: boolean;
  lineaServicios?: LineaServicio[];
}

export interface UpdateOrdenRequest {
  numeroOrden?: string;
  fechaIngreso?: string; // ISO 8601
  fechaEntrega?: string; // ISO 8601
  descripcion?: string;
  estado?: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";
  clienteId?: number;
  vehiculoId?: number;
  mecanicoId?: number;
  status?: boolean;
  lineaServicios?: LineaServicio[];
}
