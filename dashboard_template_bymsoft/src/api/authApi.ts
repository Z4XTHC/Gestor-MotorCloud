import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { LoginCredentials, LoginResponse } from "../types/auth";

/**
 * @file authApi.ts
 * @description Funciones para interactuar con la API de Autenticación.
 * @version 3.0 (API Integration)
 * @date 28/02/2026
 */

/**
 * Realiza el proceso de inicio de sesión.
 * @param credentials - Objeto con username y password.
 * @returns Una promesa que se resuelve con los datos del usuario y los tokens.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials,
  );
  return data;
}

/**
 * Solicita el restablecimiento de contraseña enviando un email.
 * @param email - Email del usuario que solicita el restablecimiento.
 * @returns Una promesa que se resuelve con la respuesta del servidor.
 */
export async function forgotPassword(email: string): Promise<any> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    { email },
  );
  return data;
}

/**
 * Verifica un usuario a través de un ID (token de verificación).
 * @param id - El ID de activación/verificación del usuario.
 * @returns Una promesa que se resuelve con los datos del usuario verificado.
 */
export async function verifyUser(id: string): Promise<any> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.VERIFY_USER(id));
  return data;
}

/**
 * Verifica si el token de autenticación actual es válido.
 * @returns Una promesa que se resuelve con los datos del usuario si el token es válido.
 */
export async function checkAuth(): Promise<any> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.CHECK);
  return data;
}

/**
 * Cierra la sesión del usuario actual.
 * @returns Una promesa que se resuelve cuando la sesión se cierra.
 */
export async function logout(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
}

/**
 * Actualiza la contraseña de un usuario existente.
 * @param id - El ID del usuario.
 * @param password - La nueva contraseña.
 */
export async function updatePassword(
  id: string,
  password: string,
): Promise<any> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.AUTH.UPDATE_PASSWORD(id),
    { password },
  );
  return data;
}
