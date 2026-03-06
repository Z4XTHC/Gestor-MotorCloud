/**
 * @file vehiculos.ts
 * @description Tipos e interfaces para Vehiculo - Corresponde con Vehiculo.java
 * @version 2.0
 * @date 06/03/2026
 */

import { Cliente } from "./cliente";

/**
 * Interfaz para el vehiculo
 * Corresponde exactamente con la entidad Vehiculo.java del backend.
 * Spring Boot serializa la relación ManyToOne como objeto anidado.
 */
export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  patente: string;
  status: boolean;
  /** Objeto cliente serializado por Spring Boot (ManyToOne) */
  cliente?: Partial<Cliente>;
  /** Alias de conveniencia - usar cliente.id para el ID real */
  clienteId?: number;
}

export interface CreateVehiculoRequest {
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  patente: string;
  status?: boolean;
  /** Spring Boot espera { "cliente": {"id": N} } para la FK */
  cliente: { id: number };
}

export interface UpdateVehiculoRequest {
  marca?: string;
  modelo?: string;
  anio?: number;
  color?: string;
  patente?: string;
  status?: boolean;
  cliente?: { id: number };
}
