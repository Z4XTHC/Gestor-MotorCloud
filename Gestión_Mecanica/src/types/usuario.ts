/**
 * @file usuario.ts
 * @description Tipos e interfaces para Usuario - Corresponde con Usuario.java
 * @version 2.0
 * @date 28/02/2026
 */

/**
 * Interfaz para el Usuario
 * Corresponde exactamente con la entidad Usuario.java del backend
 */
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  rol: "ADMIN" | "USER";
  status: boolean;
}

/**
 * Interfaz para crear Usuario
 */
export interface CreateUsuarioRequest {
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  rol: "ADMIN" | "USER";
  status?: boolean;
}

/**
 * Interfaz para actualizar Usuario
 */
export interface UpdateUsuarioRequest {
  nombre?: string;
  apellido?: string;
  username?: string;
  rol?: "ADMIN" | "USER";
  status?: boolean;
}

/**
 * Interfaz para login de Usuario
 */
export interface LoginRequest {
  username: string;
  password: string;
}
