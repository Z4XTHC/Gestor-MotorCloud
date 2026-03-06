/**
 * @file auth.ts
 * @description Tipos e interfaces para Autenticación
 * @version 2.0
 * @date 28/02/2026
 */

import { Usuario } from "./usuario";

/**
 * Credenciales para login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Respuesta de login
 */
export interface LoginResponse {
  user: Usuario;
  accessToken: string;
  refreshToken?: string;
}

/**
 * Respuesta de verificación de sesión
 */
export interface AuthCheckResponse {
  authenticated: boolean;
  user?: Usuario;
  message?: string;
}

/**
 * Respuesta de forgot password
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Datos para reset de password
 */
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

/**
 * Respuesta de reset password
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
