import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import {
  Inventario,
  CreateInventarioRequest,
  UpdateInventarioRequest,
} from "../types/inventario";

/**
 * @file inventarioApi.ts
 * @description Funciones para interactuar con la API de Inventario.
 * @version 1.0
 * @date 09/03/2026
 */

export async function obtenerInventario(
  params?: Record<string, unknown>,
): Promise<Inventario[]> {
  const response = await axiosInstance.get(API_ENDPOINTS.INVENTARIO.LIST, {
    params,
  });
  const data = response.data;
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function obtenerInventarioPorId(id: string): Promise<Inventario> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.INVENTARIO.GET(id));
  return data;
}

export async function crearItemInventario(
  payload: CreateInventarioRequest,
): Promise<Inventario> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.INVENTARIO.CREATE,
    payload,
  );
  return data;
}

export async function actualizarItemInventario(
  id: string,
  payload: UpdateInventarioRequest,
): Promise<Inventario> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.INVENTARIO.UPDATE(id),
    payload,
  );
  return data;
}

export async function eliminarItemInventario(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.INVENTARIO.DELETE(id));
}

export async function actualizarEstadoInventario(params: {
  id: string;
  status: boolean;
}): Promise<Inventario> {
  const { data } = await axiosInstance.patch(
    API_ENDPOINTS.INVENTARIO.TOGGLE_STATUS(params.id),
    { status: params.status },
  );
  return data;
}
