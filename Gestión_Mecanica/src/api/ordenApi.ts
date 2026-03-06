import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Orden, CreateOrdenPayload } from "../types/orden";

export type CrearOrdenPayload = CreateOrdenPayload;
export type ActualizarOrdenPayload = Partial<CreateOrdenPayload>;

export async function obtenerOrdenes(): Promise<Orden[]> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDENES.LIST);
  return Array.isArray(data) ? data : data || [];
}

export async function obtenerOrdenPorId(id: string): Promise<Orden> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDENES.GET(id));
  return data;
}

export async function crearOrden(payload: CreateOrdenPayload): Promise<Orden> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.ORDENES.CREATE,
    payload,
  );
  return data;
}

export async function actualizarOrden(
  id: string,
  payload: Partial<CreateOrdenPayload>,
): Promise<Orden> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.ORDENES.UPDATE(id),
    payload,
  );
  return data;
}

export async function cambiarEstadoOrden(
  id: string,
  status: boolean,
): Promise<Orden> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.ORDENES.TOGGLE_STATUS(id),
    { status },
  );
  return data;
}
