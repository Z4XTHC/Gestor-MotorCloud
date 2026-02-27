/**
 * @file src/types/orden.ts
 * @description Interfaz para la entidad Orden (Orden de Trabajo).
 * @version 1.0
 * @date 25/12/2025
 */

/**
 * Representa la estructura de una Orden de Trabajo.
 * La interfaz puede ser más compleja si la API devuelve objetos anidados.
 */
export interface Orden {
  id: string;
  numeroorden?: string;
  tipoOrden_id: string;
  sucursal_id: string;
  cliente_id: string;
  fechainicio: string;
  fechafin?: string;
  fechavencimiento?: string;
  // Opcionalmente, si la API devuelve los objetos completos:
  // tipoOrden?: any;
  // sucursal?: any;
  // cliente?: any;
}

/**
 * Payload para la creación de una Orden.
 * Se define por separado para mayor claridad en los formularios.
 */
export interface CrearOrdenPayload {
  tipoOrden_id: string;
  sucursal_id: string;
  cliente_id: string;
  fechainicio: string;
  fechafin?: string;
  fechavencimiento?: string;
}

/**
 * Payload para la actualización de una Orden.
 */
export interface ActualizarOrdenPayload extends Partial<CrearOrdenPayload> {
  numeroorden?: string;
}