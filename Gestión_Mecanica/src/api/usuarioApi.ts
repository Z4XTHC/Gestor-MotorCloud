import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Usuario } from "../types/usuario";

/**
 * @file usuarioApi.ts
 * @description Funciones para interactuar con la API de Usuarios.
 * @version 1.0 (API Integration)
 * @date 24/03/2026
 */

/**
 * Obtiene la lista de usuarios.
 * @param params - Parámetros opcionales para filtrar la lista de usuarios.
 * @returns Una promesa que se resuelve en un array de Usuarios.
 */
export async function obtenerUsuarios(
  params?: Record<string, unknown>,
): Promise<Usuario[]> {
  const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST, {
    params,
  });
  const data = response.data;
  return Array.isArray(data) ? data : (data?.data ?? []);
}

/**
 * Obtiene un usuario específico por su ID.
 * @param id - El ID del usuario.
 * @returns Una promesa que se resuelve con los datos del Usuario.
 */
export async function obtenerUsuarioPorId(id: string): Promise<Usuario> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.USERS.GET(id));
  return data;
}

/**
 * Crea un nuevo usuario.
 * @param payload - Objeto con los datos del usuario a crear.
 * @returns Una promesa que se resuelve con el usuario creado.
 */
export async function crearUsuario(
  payload: Partial<Usuario>,
): Promise<Usuario> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.USERS.CREATE,
    payload,
  );
  return data;
}

/**
 * Actualiza un usuario existente.
 * @param id - El ID del usuario a actualizar.
 * @param payload - Objeto con los datos a modificar.
 * @returns Una promesa que se resuelve con el usuario actualizado.
 */
export async function actualizarUsuario(
  id: string,
  payload: Partial<Usuario>,
): Promise<Usuario> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.USERS.UPDATE(id),
    payload,
  );
  return data;
}

/**
 * Elimina un usuario por su ID.
 * @param id - El ID del usuario a eliminar.
 * @returns Una promesa que se resuelve cuando el usuario ha sido eliminado.
 */
export async function eliminarUsuario(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
}

/**
 * Actualiza el estado de un usuario (activo/inactivo).
 * @param id - El ID del usuario a actualizar.
 * @param status - El nuevo estado del usuario.
 * @returns Una promesa que se resuelve con el usuario actualizado.
 */
export async function actualizarEstadoUsuario(
  id: string,
  status: boolean,
): Promise<Usuario> {
  const { data } = await axiosInstance.patch(
    API_ENDPOINTS.USERS.UPDATE_STATUS(id),
    { status },
  );
  return data;
}
