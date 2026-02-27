/**
 * @file src/types/empleado.ts
 * @description Interfaz para la entidad Empleado.
 * @version 1.0
 * @date 25/12/2025
 */

/**
 * Representa la estructura de un Empleado en el sistema.
 */
export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  fechadeingreso: string; // O Date, dependiendo de cómo se maneje
  tipo: string; // Ej: 'Contratado', 'Permanente'. Podría ser un enum.
  documento: string;
  cuit: string;
  cliente_id: string;
  sucursal_id: string;
}

/**
 * Payload para la creación o actualización de un Empleado.
 * Se define por separado para mayor claridad.
 */
export interface EmpleadoPayload {
  nombre: string;
  apellido: string;
  fechadeingreso: string;
  tipo: string;
  documento: string;
  cuit: string;
  cliente_id: string;
  sucursal_id: string;
}
