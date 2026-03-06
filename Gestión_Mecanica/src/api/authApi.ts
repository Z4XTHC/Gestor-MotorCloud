import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { LoginCredentials } from "../types/auth";

/**
 * @file authApi.ts
 * @description Funciones para interactuar con la API de Autenticación.
 * @version 4.0 (Session-based auth)
 */

/**
 * Realiza el proceso de inicio de sesión.
 * El backend usa @RequestParam, por lo que se envía como form-url-encoded.
 */
export async function login(credentials: LoginCredentials): Promise<any> {
  const params = new URLSearchParams();
  params.append("username", credentials.username);
  params.append("password", credentials.password);

  const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function logout(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
}

/**
 * Verifica si hay una sesión activa en el servidor.
 */
export async function checkAuth(): Promise<any> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.CHECK);
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
