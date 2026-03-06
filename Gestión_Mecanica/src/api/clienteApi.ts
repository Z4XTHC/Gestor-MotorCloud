import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Cliente } from "../types/cliente";

/**
 * @file clienteApi.ts
 * @description Funciones para interactuar con la API de Clientes.
 * @version 1.0 (API Integration)
 * @date 28/02/2026
 */

/**
 * Obtiene la lista de clientes.
 * @param params - Parámetros opcionales para filtrar la lista de clientes.
 * @returns Una promesa que se resuelve en un array de Clientes.
 */
export async function obtenerClientes(
  params?: Record<string, unknown>,
): Promise<Cliente[]> {
  const response = await axiosInstance.get(API_ENDPOINTS.CLIENTES.LIST, {
    params,
  });
  const data = response.data;
  console.log("[clienteApi] RAW response:", JSON.stringify(data));
  return Array.isArray(data) ? data : (data?.data ?? []);
}

/**
 * Obtiene un cliente específico por su ID.
 * @param id - El ID del cliente.
 * @returns Una promesa que se resuelve con los datos del Cliente.
 */
export async function obtenerClientePorId(id: string): Promise<Cliente> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.CLIENTES.GET(id));
  return data;
}

/**
 * Crea un nuevo cliente.
 * @param payload - Objeto con los datos del cliente a crear.
 * @returns Una promesa que se resuelve con el cliente creado.
 */
export async function crearCliente(
  payload: Partial<Cliente>,
): Promise<Cliente> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.CLIENTES.CREATE,
    payload,
  );
  return data;
}

/**
 * Actualiza un cliente existente.
 * @param id - El ID del cliente a actualizar.
 * @param payload - Objeto con los datos a modificar.
 * @returns Una promesa que se resuelve con el cliente actualizado.
 */
export async function actualizarCliente(
  id: string,
  payload: Partial<Cliente>,
): Promise<Cliente> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.CLIENTES.UPDATE(id),
    payload,
  );
  return data;
}

/**
 * Elimina un cliente por su ID.
 * @param id - El ID del cliente a eliminar.
 * @returns Una promesa que se resuelve cuando el cliente es eliminado.
 */
export async function eliminarCliente(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.CLIENTES.DELETE(id));
}

/**
 * Actualiza solo el estado (activo/inactivo) de un cliente.
 * @param id - El ID del cliente.
 * @param status - El nuevo estado del cliente (true para activo, false para inactivo).
 * @return Una promesa que se resuelve con el cliente actualizado.
 */
export async function actualizarEstadoCliente({
  id,
  status,
}: {
  id: string;
  status: boolean;
}): Promise<Cliente> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.CLIENTES.TOGGLE_STATUS(id),
    {
      status,
    },
  );
  return data;
}
