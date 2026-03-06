/**
 * @file index.ts
 * @description Exportaciones centralizadas de tipos
 * @version 2.0
 * @date 28/02/2026
 */

// Tipos de Usuario
export type {
  Usuario,
  UpdateUsuarioRequest,
  CreateUsuarioRequest,
  LoginRequest,
} from "./usuario";

// Tipos de Autenticación
export type {
  LoginCredentials,
  LoginResponse,
  AuthCheckResponse,
  ForgotPasswordResponse,
  ResetPasswordData,
  ResetPasswordResponse,
} from "./auth";

// Tipo User (alias de Usuario para compatibilidad)
export type User = import("./usuario").Usuario;

// Tipo AuthResponse para contextos
export interface AuthResponse {
  authenticated: boolean;
  user?: User;
}
