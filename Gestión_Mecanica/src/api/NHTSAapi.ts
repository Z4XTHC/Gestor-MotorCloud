/**
 * @file NHTSAapi.ts
 * @description Funciones para interactuar con la API pública de NHTSA
 *              (National Highway Traffic Safety Administration).
 *              Usa `fetch` nativo para evitar conflictos CORS con las
 *              credenciales del axiosInstance del backend.
 * @see https://vpic.nhtsa.dot.gov/api/
 */

const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";

export interface NHTSAMake {
  Make_ID: number;
  Make_Name: string;
}

export interface NHTSAModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

/** Retorna todas las marcas (makes) registradas en NHTSA. ~9 000+ resultados. */
export async function obtenerTodasLasMarcas(): Promise<NHTSAMake[]> {
  const res = await fetch(`${NHTSA_BASE}/GetAllMakes?format=json`);
  if (!res.ok) throw new Error(`NHTSA GetAllMakes: ${res.status}`);
  const data = await res.json();
  return (data.Results as NHTSAMake[]) ?? [];
}

/** Retorna los modelos disponibles para una marca dada. */
export async function obtenerModelosPorMarca(marca: string): Promise<NHTSAModel[]> {
  const encoded = encodeURIComponent(marca);
  const res = await fetch(`${NHTSA_BASE}/GetModelsForMake/${encoded}?format=json`);
  if (!res.ok) throw new Error(`NHTSA GetModelsForMake: ${res.status}`);
  const data = await res.json();
  return (data.Results as NHTSAModel[]) ?? [];
}