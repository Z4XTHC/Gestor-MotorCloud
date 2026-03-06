import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Notificacion, ConteoNoLeidas } from "../types/notificacion";

/**
 * @file notificacionApi.ts
 * @description Funciones para interactuar con la API de Notificaciones.
 * @version 1.0 (Mock Mode - Original code commented)
 * @date 04/02/2026
 */

/*
// ===== CÓDIGO ORIGINAL (COMENTADO) - PARA USO FUTURO =====
// Este código original usa axios y API_ENDPOINTS para consumir servicios reales
// Descomenta estas funciones cuando conectes a un backend real

/**
 * Obtiene la lista de notificaciones del usuario actual.
 * @param params - Parámetros opcionales para filtrar las notificaciones.
 * @returns Una promesa que se resuelve en un array de Notificaciones.
 */
/*
export async function obtenerNotificaciones(
  params?: Record<string, any>
): Promise<Notificacion[]> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.NOTIFICACIONES.LIST, {
    params,
  });
  return data;
}
*/

/**
 * Obtiene el conteo de notificaciones no leídas.
 * @returns Una promesa que se resuelve con el conteo de notificaciones no leídas.
 */
/*
export async function obtenerConteoNoLeidas(): Promise<ConteoNoLeidas> {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.NOTIFICACIONES.COUNT_UNREAD
  );
  return data;
}
*/

/**
 * Marca una notificación como leída.
 * @param id - El ID de la notificación a marcar como leída.
 * @returns Una promesa que se resuelve con la notificación actualizada.
 */
/*
export async function marcarComoLeida(id: string): Promise<Notificacion> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.NOTIFICACIONES.MARK_READ(id)
  );
  return data;
}
*/

/**
 * Marca todas las notificaciones como leídas.
 * @returns Una promesa que se resuelve cuando todas las notificaciones se marcan como leídas.
 */
/*
export async function marcarTodasComoLeidas(): Promise<void> {
  await axiosInstance.put(API_ENDPOINTS.NOTIFICACIONES.MARK_ALL_READ);
}
*/

/**
 * Elimina una notificación específica.
 * @param id - El ID de la notificación a eliminar.
 * @returns Una promesa que se resuelve cuando la notificación se elimina.
 */
/*
export async function eliminarNotificacion(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.NOTIFICACIONES.DELETE(id));
}
*/

/**
 * Crea una nueva notificación.
 * @param payload - Los datos de la notificación a crear.
 * @returns Una promesa que se resuelve con la notificación creada.
 */
/*
export async function crearNotificacion(payload: Partial<Notificacion>): Promise<Notificacion> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.NOTIFICACIONES.CREATE,
    payload
  );
  return data;
}
*/

// ===== FIN DEL CÓDIGO ORIGINAL COMENTADO =====

// Datos simulados de notificaciones
const mockNotificaciones: Notificacion[] = [
  {
    _id: "1",
    id: "1",
    textoDescriptivo:
      "Bienvenido al Dashboard Template. Esta es una notificación de ejemplo.",
    leida: false,
    tipo: "info",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
  },
  {
    _id: "2",
    id: "2",
    textoDescriptivo: "Tu perfil ha sido actualizado correctamente.",
    leida: true,
    tipo: "success",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
  },
  {
    _id: "3",
    id: "3",
    textoDescriptivo: "Recuerda revisar las páginas de ejemplo del template.",
    leida: false,
    tipo: "warning",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
  },
];

/**
 * Obtiene todas las notificaciones para el usuario autenticado (simulado).
 * @returns Una promesa que se resuelve en un array de Notificaciones.
 */
export async function obtenerNotificaciones(): Promise<Notificacion[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Retornar copia de los datos simulados
  return [...mockNotificaciones];
}

/**
 * Marca una notificación específica como leída (simulado).
 * @param id - El ID de la notificación a marcar.
 * @returns Una promesa que se resuelve con la notificación actualizada.
 */
export async function marcarNotificacionComoLeida(
  id: string,
): Promise<Notificacion> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Encontrar y actualizar la notificación
  const notif = mockNotificaciones.find((n) => n.id === id);
  if (notif) {
    notif.leida = true;
    return { ...notif };
  }

  throw new Error("Notificación no encontrada");
}

/**
 * Marca todas las notificaciones del usuario como leídas (simulado).
 * @returns Una promesa que se resuelve cuando la operación es exitosa.
 */
export async function marcarTodasComoLeidas(): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Marcar todas como leídas
  mockNotificaciones.forEach((notif) => {
    notif.leida = true;
  });
}

/**
 * Elimina una notificación específica (simulado).
 * @param id - El ID de la notificación a eliminar.
 */
export async function eliminarNotificacion(id: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Encontrar el índice y eliminar
  const index = mockNotificaciones.findIndex((n) => n.id === id);
  if (index !== -1) {
    mockNotificaciones.splice(index, 1);
  } else {
    throw new Error("Notificación no encontrada");
  }
}

/**
 * Obtiene el número de notificaciones no leídas para el usuario (simulado).
 * @returns Una promesa que se resuelve con el conteo.
 */
export async function obtenerConteoNoLeidas(): Promise<ConteoNoLeidas> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Contar notificaciones no leídas
  const noLeidas = mockNotificaciones.filter((n) => !n.leida).length;

  return {
    count: noLeidas,
  };
}
