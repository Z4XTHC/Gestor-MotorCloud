import axiosInstance from "./axiosConfig.ts";
import { API_ENDPOINTS } from "../constants/api.ts";
import { Orden } from "../types/orden.ts";

/**
 * Obtiene los datos de una orden de trabajo por su número.
 * @param numeroOrden El número de la orden de trabajo.
 * @returns Una promesa que se resuelve con los datos de la orden de trabajo.
 */
export async function obtenerDatosOrden(numeroOrden: string): Promise<Orden> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDENES.GET(numeroOrden));
  return data;
}
