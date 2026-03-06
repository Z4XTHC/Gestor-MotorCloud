import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Usuario } from "../types/usuario";

/**
 * @file userApi.ts
 * @description Funciones para interactuar con la API de Usuarios.
 * @version 3.0 (API Integration)
 * @date 28/02/2026
 */

/**
 * Obtiene la lista de usuarios.
 * @param params - Parámetros opcionales para filtrar la lista de usuarios.
 * @returns Una promesa que se resuelve en un array de Usuarios.
 */
export async function obtenerUsuarios(
  params?: Record<string, any>,
): Promise<Usuario[]> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.USERS.LIST, {
    params,
  });
  return Array.isArray(data) ? data : data.data || [];
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
 */
export async function eliminarUsuario(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
}

/**
 * Actualiza solo el estado (activo/inactivo) de un usuario.
 * @param id - El ID del usuario.
 * @param active - El nuevo estado.
 * @returns Una promesa que se resuelve con el usuario actualizado.
 */
export async function actualizarEstadoUsuario({
  id,
  active,
}: {
  id: string;
  active: boolean;
}): Promise<Usuario> {
  const { data } = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(id), {
    status: active,
  });
  return data;
}
