/**
 * @file src/types/notificacion.ts
 * @description Interfaz para la entidad Notificacion.
 * @version 1.0
 * @date 25/12/2025
 */

/**
 * Representa la estructura de una Notificación en el sistema.
 */
export interface Notificacion {
  id: string;
  mensaje: string;
  leida: boolean;
  fecha: string; // Se asume un string en formato ISO 8601
  tipo?: "info" | "advertencia" | "error" | "exito"; // Tipos comunes de notificaciones
  enlace?: string; // Un enlace opcional para redirigir al usuario al hacer clic
  usuario_id: string; // A quién pertenece la notificación
}

/**
 * Representa la respuesta del endpoint que cuenta las notificaciones no leídas.
 */
export interface ConteoNoLeidas {
  count: number;
}
