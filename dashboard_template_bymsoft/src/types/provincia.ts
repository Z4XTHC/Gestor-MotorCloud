/**
 * @file provincia.ts
 * @description Define la interfaz para el objeto Provincia.
 * @version 1.0
 * @date 25/12/2025
 */

export interface Provincia {
  _id: string;
  id?: string;
  nombre: string;
  pais?: string; // ID del país al que pertenece
}
