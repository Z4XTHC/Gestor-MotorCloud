/**
 * @file src/types/capacitacion.ts
 * @description Interfaz para la entidad Capacitacion.
 * @version 1.0
 * @date 25/12/2025
 */

// Se asume que 'attendees' es un array de objetos con una estructura definida.
// Si no se conoce, se puede usar `any[]` temporalmente.
export interface Asistente {
  nombre: string;
  dni: string;
  email: string;
  // ... otros campos si los hubiera.
}

/**
 * Representa una Capacitación en el sistema.
 */
export interface Capacitacion {
  id: string; // ID de la capacitación en sí
  orden_id: string; // ID de la orden de trabajo asociada
  tipoOrden_id: string;
  sucursal_id: string;
  cliente_id: string;
  tituloCapacitacion: string;
  ispresencial: boolean;
  horainicio: string;
  horafin: string;
  fechainicio: string;
  attendees: Asistente[];
  planillaUrl?: string;
}

/**
 * Payload para la creación de una Capacitación.
 */
export interface CrearCapacitacionPayload {
  tipoOrden_id: string;
  tituloCapacitacion: string;
  ispresencial: boolean;
  horainicio: string;
  horafin: string;
  attendees: Asistente[];
  planilla?: File;
  sucursal_id: string;
  cliente_id: string;
  fechainicio: string;
  fechafin?: string;
  fechavencimiento?: string;
}

/**
 * Payload para la actualización de una Capacitación.
 */
export interface ActualizarCapacitacionPayload
  extends Partial<CrearCapacitacionPayload> {
  orden_id: string;
  filename?: string; // Para el nombre de la planilla anterior
}
