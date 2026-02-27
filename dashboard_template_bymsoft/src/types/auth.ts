/**
 * @file src/types/auth.ts
 * @description Interfaces y tipos relacionados con la autenticación.
 * @version 1.0
 * @date 25/12/2025
 */

/**
 * Representa la estructura del usuario que devuelve el API al autenticarse.
 * Se puede expandir con más campos si es necesario.
 */
export interface AuthUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
}

/**
 * Define las credenciales requeridas para el inicio de sesión.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Define la estructura de la respuesta del endpoint de login.
 */
export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}
