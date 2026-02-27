import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { LoginCredentials, LoginResponse } from "../types/auth";

/**
 * @file authApi.ts
 * @description Funciones para interactuar con la API de Autenticación.
 * @version 2.3 (Mock Mode - Original code commented)
 * @date 04/02/2026
 */

/*
// ===== CÓDIGO ORIGINAL (COMENTADO) - PARA USO FUTURO =====
// Este código original usa axios y API_ENDPOINTS para consumir servicios reales
// Descomenta estas funciones cuando conectes a un backend real

/**
 * Realiza el proceso de inicio de sesión.
 * @param credentials - Objeto con email y password.
 * @returns Una promesa que se resuelve con los datos del usuario y los tokens.
 */
/*
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return data;
}
*/

/**
 * Realiza el proceso de registro de un nuevo usuario.
 * @param userData - Objeto con los datos del usuario a registrar.
 * @returns Una promesa que se resuelve con los datos del usuario registrado.
 */
/*
export async function register(userData: any): Promise<any> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.REGISTER,
    userData
  );
  return data;
}
*/

/**
 * Solicita el restablecimiento de contraseña enviando un email.
 * @param email - Email del usuario que solicita el restablecimiento.
 * @returns Una promesa que se resuelve con la respuesta del servidor.
 */
/*
export async function forgotPassword(email: string): Promise<any> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    { email }
  );
  return data;
}
*/

/**
 * Restablece la contraseña usando el token recibido por email.
 * @param token - Token de restablecimiento.
 * @param newPassword - Nueva contraseña.
 * @returns Una promesa que se resuelve con la respuesta del servidor.
 */
/*
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<any> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    { token, newPassword }
  );
  return data;
}
*/

/**
 * Verifica si el token de autenticación actual es válido.
 * @returns Una promesa que se resuelve con los datos del usuario si el token es válido.
 */
/*
export async function verifyToken(): Promise<any> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
  return data;
}
*/

/**
 * Cierra la sesión del usuario actual.
 * @returns Una promesa que se resuelve cuando la sesión se cierra.
 */
/*
export async function logout(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
}
*/

/**
 * Actualiza el token de acceso usando el refresh token.
 * @param refreshToken - Token de refresco.
 * @returns Una promesa que se resuelve con los nuevos tokens.
 */
/*
export async function refreshToken(refreshToken: string): Promise<any> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    { refreshToken }
  );
  return data;
}
*/

// ===== FIN DEL CÓDIGO ORIGINAL COMENTADO =====

/**
 * Realiza el proceso de inicio de sesión (simulado).
 * @param credentials - Objeto con email y password.
 * @returns Una promesa que se resuelve con los datos del usuario y los tokens simulados.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simular validación básica
  if (
    credentials.email === "admin@example.com" &&
    credentials.password === "admin123"
  ) {
    return {
      user: {
        id: "1",
        email: "admin@example.com",
        nombre: "Administrador",
        apellido: "Template",
        admin: true,
        tecnico_id: null,
        cliente_id: null,
        avatar: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: "mock-jwt-token-admin",
      refreshToken: "mock-refresh-token-admin",
    };
  } else if (
    credentials.email === "user@example.com" &&
    credentials.password === "user123"
  ) {
    return {
      user: {
        id: "2",
        email: "user@example.com",
        nombre: "Usuario",
        apellido: "Template",
        admin: false,
        tecnico_id: null,
        cliente_id: "1",
        avatar: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: "mock-jwt-token-user",
      refreshToken: "mock-refresh-token-user",
    };
  } else {
    throw new Error("Credenciales inválidas");
  }
}

/**
 * Solicita un enlace para resetear la contraseña (simulado).
 * @param email - El email del usuario que solicita el reseteo.
 */
export async function solicitarReseteoPassword(email: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simular envío exitoso
  console.log(`Mock: Email de reseteo enviado a ${email}`);
}

/**
 * Verifica un usuario a través de un ID (simulado).
 * @param id - El ID de activación/verificación del usuario.
 * @returns Una promesa con datos opcionales (ej: un token temporal).
 */
export async function verifyUser(id: string): Promise<{ token?: string }> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simular verificación exitosa
  return {
    token: `mock-verification-token-${id}`,
  };
}

/**
 * Actualiza la contraseña de un usuario existente (simulado).
 * @param id - El ID del usuario.
 * @param password - La nueva contraseña.
 */
export async function updatePassword(
  id: string,
  password: string,
): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simular actualización exitosa
  console.log(`Mock: Contraseña actualizada para usuario ${id}`);
}
