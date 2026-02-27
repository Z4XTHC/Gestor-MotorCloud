/**
 * @file rubro.ts
 * @description Define la interfaz para el objeto Rubro.
 * @version 1.0
 * @date 25/12/2025
 */

export interface Rubro {
  _id: string;
  nombre: string;
  controlContratista?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
