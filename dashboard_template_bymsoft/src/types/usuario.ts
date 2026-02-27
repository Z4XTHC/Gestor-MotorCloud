/**
 * @file src/types/usuario.ts
 * @description Interfaz para la entidad Usuario.
 * @version 1.0
 * @date 25/12/2025
 */

/**
 * Representa un usuario en el sistema.
 */
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol?: "admin" | "tecnico" | "cliente" | string;
  estado?: string;
  // Se pueden añadir más campos según la respuesta completa de la API
}
