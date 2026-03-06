import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Vehiculo } from "../types/vehiculo";

/**
 * @file vehiculoApi.ts
 * @description Funciones para interactuar con la API de Vehículos.
 * @version 3.0 (API Integration)
 * @date 28/02/2026
 */

/**
 * Obtiene la lista de vehículos.
 * @param params - Parámetros opcionales para filtrar la lista de vehículos.
 * @returns Una promesa que se resuelve en un array de Vehículos.
 */
export async function obtenerVehiculos(
  params?: Record<string, unknown>,
): Promise<Vehiculo[]> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.VEHICULOS.LIST, {
    params,
  });
  return Array.isArray(data) ? data : data.data || [];
}

/**
 * Obtiene un vehículo específico por su ID.
 * @param id - El ID del vehículo.
 * @returns Una promesa que se resuelve con los datos del Vehículo.
 */
export async function obtenerVehiculoPorId(id: string): Promise<Vehiculo> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.VEHICULOS.GET(id));
  return data;
}

/**
 * Crea un nuevo vehículo.
 * @param payload - Objeto con los datos del vehículo a crear.
 * @returns Una promesa que se resuelve con el vehículo creado.
 */
export async function crearVehiculo(
  payload: Partial<Vehiculo>,
): Promise<Vehiculo> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.VEHICULOS.CREATE,
    payload,
  );
  return data;
}

/**
 * Actualiza un vehículo existente.
 * @param id - El ID del vehículo a actualizar.
 * @param payload - Objeto con los datos a modificar.
 * @returns Una promesa que se resuelve con el vehículo actualizado.
 */
export async function actualizarVehiculo(
  id: string,
  payload: Partial<Vehiculo>,
): Promise<Vehiculo> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.VEHICULOS.UPDATE(id),
    payload,
  );
  return data;
}

/**
 * Elimina un vehículo por su ID.
 * @param id - El ID del vehículo a eliminar.
 * @returns Una promesa que se resuelve cuando el vehículo ha sido eliminado.
 */
export async function eliminarVehiculo(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.VEHICULOS.DELETE(id));
}

/**
 * Actualiza solo el estado de un vehículo.
 * @param id - El ID del vehículo.
 * @param estado - El nuevo estado del vehículo (activo/inactivo).
 * @returns Una promesa que se resuelve con el vehículo actualizado.
 */
export async function actualizarEstadoVehiculo({
  id,
  status,
}: {
  id: string;
  status: boolean;
}): Promise<Vehiculo> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.VEHICULOS.TOGGLE_STATUS(id),
    {
      status,
    },
  );
  return data;
}
