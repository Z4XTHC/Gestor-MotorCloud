import axiosInstance from "./axiosConfig.ts";
import { API_ENDPOINTS } from "../constants/api";
import { Empresa } from "../types/empresa";

/**
 * @file empresaApi.ts
 * @description Funciones para interactuar con la API de Datos de la Empresa.
 * @version 3.0 (API Integration)
 * @date 11/03/2026
 */

/**
 * Obtiene los datos de la empresa.
 * @returns Una promesa que se resuelve con los datos de la Empresa.
 */
export async function obtenerDatosEmpresa(): Promise<Empresa> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.EMPRESA.GET);
  return data;
}
