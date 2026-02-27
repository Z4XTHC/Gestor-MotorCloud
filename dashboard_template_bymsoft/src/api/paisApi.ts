import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Pais } from "../types/pais";

/**
 * @file paisApi.ts
 * @description Funciones para interactuar con la API de Países.
 * @version 1.0 (Mock Mode - Original code commented)
 * @date 04/02/2026
 */

/*
// ===== CÓDIGO ORIGINAL (COMENTADO) - PARA USO FUTURO =====
// Este código original usa axios y API_ENDPOINTS para consumir servicios reales
// Descomenta estas funciones cuando conectes a un backend real

/**
 * Obtiene la lista de países.
 * @returns Una promesa que se resuelve en un array de Países.
 */
/*
export async function obtenerPaises(): Promise<Pais[]> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.PAISES.LIST);
  return data;
}
*/

/**
 * Obtiene un país específico por su ID.
 * @param id - El ID del país.
 * @returns Una promesa que se resuelve con el país.
 */
/*
export async function obtenerPaisPorId(id: string): Promise<Pais> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.PAISES.GET(id));
  return data;
}
*/

// ===== FIN DEL CÓDIGO ORIGINAL COMENTADO =====

// Datos simulados de países
const mockPaises: Pais[] = [
  {
    id: "1",
    nombre: "Argentina",
    codigo: "AR",
    activo: true,
  },
  {
    id: "2",
    nombre: "Brasil",
    codigo: "BR",
    activo: true,
  },
  {
    id: "3",
    nombre: "Chile",
    codigo: "CL",
    activo: true,
  },
  {
    id: "4",
    nombre: "Uruguay",
    codigo: "UY",
    activo: true,
  },
  {
    id: "5",
    nombre: "Paraguay",
    codigo: "PY",
    activo: true,
  },
  {
    id: "6",
    nombre: "Bolivia",
    codigo: "BO",
    activo: true,
  },
  {
    id: "7",
    nombre: "Perú",
    codigo: "PE",
    activo: true,
  },
  {
    id: "8",
    nombre: "Colombia",
    codigo: "CO",
    activo: true,
  },
  {
    id: "9",
    nombre: "Venezuela",
    codigo: "VE",
    activo: true,
  },
  {
    id: "10",
    nombre: "Ecuador",
    codigo: "EC",
    activo: true,
  },
];

/**
 * Obtiene la lista de países (simulado).
 * @returns Una promesa que se resuelve en un array de Países.
 */
export async function obtenerPaises(): Promise<Pais[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  return [...mockPaises];
}

/**
 * Obtiene un país específico por su ID (simulado).
 * @param id - El ID del país.
 * @returns Una promesa que se resuelve con el país.
 */
export async function obtenerPaisPorId(id: string): Promise<Pais> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Buscar el país
  const pais = mockPaises.find((p) => p.id === id);
  if (!pais) {
    throw new Error("País no encontrado");
  }

  return { ...pais };
}

const paisApi = {
  obtenerPaises,
  obtenerPaisPorId,
};

export default paisApi;
