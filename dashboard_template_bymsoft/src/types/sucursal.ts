/**
 * @file src/types/sucursal.ts
 * @description Interfaz para la entidad Sucursal.
 * @version 1.0
 * @date 25/12/2025
 */

/**
 * Representa la estructura de una Sucursal.
 * Los campos opcionales (?) se usan para payloads parciales.
 */
export interface Sucursal {
  id: string;
  direccion: string;
  cliente_id: string; // ID del cliente al que pertenece
  localidad_id: string; // ID de la localidad
  telefono?: string;
  email?: string;
  secondEmail?: string;
  // Podríamos incluir los objetos completos si la API los devuelve populados
  // cliente?: Cliente;
  // localidad?: Localidad;
}
