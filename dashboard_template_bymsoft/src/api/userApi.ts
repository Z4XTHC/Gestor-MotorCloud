import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Usuario } from "../types/usuario";

/**
 * @file userApi.ts
 * @description Funciones para interactuar con la API de Usuarios.
 * @version 2.0 (Mock Mode - Original code commented)
 * @date 04/02/2026
 */

/*
// ===== CÓDIGO ORIGINAL (COMENTADO) - PARA USO FUTURO =====
// Este código original usa axios y API_ENDPOINTS para consumir servicios reales
// Descomenta estas funciones cuando conectes a un backend real

/**
 * Obtiene la lista de usuarios.
 * @param params - Parámetros opcionales para filtrar la lista de usuarios.
 * @returns Una promesa que se resuelve en un array de Usuarios.
 */
/*
export async function obtenerUsuarios(
  params?: Record<string, any>
): Promise<Usuario[]> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.USUARIOS.LIST, {
    params,
  });
  return data;
}
*/

/**
 * Obtiene un usuario específico por su ID.
 * @param id - El ID del usuario.
 * @returns Una promesa que se resuelve con los datos del Usuario.
 */
/*
export async function obtenerUsuarioPorId(id: string): Promise<Usuario> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.USUARIOS.GET(id));
  return data;
}
*/

/**
 * Obtiene el perfil del usuario actualmente autenticado.
 * @returns Una promesa que se resuelve con los datos del perfil del usuario.
 */
/*
export async function obtenerPerfilUsuario(): Promise<Usuario> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.USUARIOS.PROFILE);
  return data;
}
*/

/**
 * Crea un nuevo usuario.
 * @param payload - Objeto con los datos del usuario a crear.
 * @returns Una promesa que se resuelve con el usuario creado.
 */
/*
export async function crearUsuario(payload: Partial<Usuario>): Promise<Usuario> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.USUARIOS.CREATE,
    payload
  );
  return data;
}
*/

/**
 * Actualiza un usuario existente.
 * @param id - El ID del usuario a actualizar.
 * @param payload - Objeto con los datos a modificar.
 * @returns Una promesa que se resuelve con el usuario actualizado.
 */
/*
export async function actualizarUsuario(
  id: string,
  payload: Partial<Usuario>
): Promise<Usuario> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.USUARIOS.UPDATE(id),
    payload
  );
  return data;
}
*/

/**
 * Actualiza el perfil del usuario actualmente autenticado.
 * @param payload - Objeto con los datos a modificar en el perfil.
 * @returns Una promesa que se resuelve con el perfil actualizado.
 */
/*
export async function actualizarPerfilUsuario(
  payload: Partial<Usuario>
): Promise<Usuario> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.USUARIOS.UPDATE_PROFILE,
    payload
  );
  return data;
}
*/

/**
 * Elimina un usuario por su ID.
 * @param id - El ID del usuario a eliminar.
 */
/*
export async function eliminarUsuario(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.USUARIOS.DELETE(id));
}
*/

/**
 * Cambia la contraseña del usuario actualmente autenticado.
 * @param currentPassword - Contraseña actual.
 * @param newPassword - Nueva contraseña.
 * @returns Una promesa que se resuelve con la respuesta del servidor.
 */
/*
export async function cambiarPassword(
  currentPassword: string,
  newPassword: string
): Promise<any> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.USUARIOS.CHANGE_PASSWORD,
    { currentPassword, newPassword }
  );
  return data;
}
*/

/**
 * Actualiza solo el estado (activo/inactivo) de un usuario.
 * @param id - El ID del usuario.
 * @param active - El nuevo estado.
 * @returns Una promesa que se resuelve con el usuario actualizado.
 */
/*
export async function actualizarEstadoUsuario({
  id,
  active,
}: {
  id: string;
  active: boolean;
}): Promise<Usuario> {
  const { data } = await axiosInstance.put(API_ENDPOINTS.USUARIOS.UPDATE(id), {
    active,
  });
  return data;
}
*/

// ===== FIN DEL CÓDIGO ORIGINAL COMENTADO =====

// Datos simulados de usuarios
const mockUsuarios: Usuario[] = [
  {
    id: "1",
    email: "admin@example.com",
    nombre: "Administrador",
    apellido: "Template",
    admin: true,
    tecnico_id: null,
    cliente_id: null,
    avatar: null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@example.com",
    nombre: "Usuario",
    apellido: "Template",
    admin: false,
    tecnico_id: null,
    cliente_id: "1",
    avatar: null,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días atrás
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "tecnico@example.com",
    nombre: "Técnico",
    apellido: "Ejemplo",
    admin: false,
    tecnico_id: "1",
    cliente_id: null,
    avatar: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Obtiene una lista de todos los usuarios (simulado).
 * @returns Una promesa que se resuelve con un array de Usuarios.
 */
export async function obtenerUsuarios(): Promise<Usuario[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Retornar copia de los datos simulados
  return [...mockUsuarios];
}

/**
 * Obtiene un usuario específico por su ID (simulado).
 * @param id - El ID del usuario.
 * @returns Una promesa que se resuelve con los datos del Usuario.
 */
export async function obtenerUsuarioPorId(id: string): Promise<Usuario> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Buscar el usuario
  const usuario = mockUsuarios.find((u) => u.id === id);
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  return { ...usuario };
}

/**
 * Crea un nuevo usuario (simulado).
 * @param payload - Objeto con los datos del usuario a crear.
 * @returns Una promesa que se resuelve con el usuario creado.
 */
export async function crearUsuario(
  payload: Partial<Usuario>,
): Promise<Usuario> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Crear nuevo usuario
  const nuevoUsuario: Usuario = {
    id: Date.now().toString(),
    email: payload.email || "",
    nombre: payload.nombre || "",
    apellido: payload.apellido || "",
    admin: payload.admin || false,
    tecnico_id: payload.tecnico_id || null,
    cliente_id: payload.cliente_id || null,
    avatar: payload.avatar || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Agregar a la lista simulada
  mockUsuarios.push(nuevoUsuario);

  return { ...nuevoUsuario };
}

/**
 * Actualiza un usuario existente (simulado).
 * @param id - El ID del usuario a actualizar.
 * @param payload - Objeto con los datos a modificar.
 * @returns Una promesa que se resuelve con el usuario actualizado.
 */
export async function actualizarUsuario(
  id: string,
  payload: Partial<Usuario>,
): Promise<Usuario> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Encontrar y actualizar el usuario
  const index = mockUsuarios.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("Usuario no encontrado");
  }

  // Actualizar el usuario
  mockUsuarios[index] = {
    ...mockUsuarios[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  return { ...mockUsuarios[index] };
}

/**
 * Elimina un usuario por su ID (simulado).
 * @param id - El ID del usuario a eliminar.
 */
export async function eliminarUsuario(id: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Encontrar y eliminar el usuario
  const index = mockUsuarios.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("Usuario no encontrado");
  }

  mockUsuarios.splice(index, 1);
}
