import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import {
  Proveedor,
  CreateProveedorRequest,
  UpdateProveedorRequest,
} from "../types/proveedor";

/**
 * @file proveedorApi.ts
 * @description Funciones para interactuar con la API de Proveedores.
 * @version 1.0
 * @date 09/03/2026
 */

export async function obtenerProveedores(
  params?: Record<string, unknown>,
): Promise<Proveedor[]> {
  const response = await axiosInstance.get(API_ENDPOINTS.PROVEEDORES.LIST, {
    params,
  });
  const data = response.data;
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function obtenerProveedorPorId(id: string): Promise<Proveedor> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.PROVEEDORES.GET(id));
  return data;
}

export async function crearProveedor(
  payload: CreateProveedorRequest,
): Promise<Proveedor> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.PROVEEDORES.CREATE,
    payload,
  );
  return data;
}

export async function actualizarProveedor(
  id: string,
  payload: UpdateProveedorRequest,
): Promise<Proveedor> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.PROVEEDORES.UPDATE(id),
    payload,
  );
  return data;
}

export async function eliminarProveedor(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.PROVEEDORES.DELETE(id));
}

export async function actualizarEstadoProveedor(params: {
  id: string;
  status: boolean;
}): Promise<Proveedor> {
  const { data } = await axiosInstance.patch(
    API_ENDPOINTS.PROVEEDORES.TOGGLE_STATUS(params.id),
    { status: params.status },
  );
  return data;
}
