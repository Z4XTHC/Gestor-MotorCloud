import { Rubro } from "./rubro";
import { CategoriaAfip } from "./categoriaAfip";

/**
 * @file src/types/cliente.ts
 * @description Interfaz para la entidad Cliente.
 * @version 2.0
 * @date 25/12/2025
 */

/**
 * Representa la estructura completa de un Cliente, incluyendo objetos anidados.
 * Los campos opcionales (?) se usan para payloads parciales o datos que no siempre están presentes.
 */
export interface Cliente {
  _id?: string;
  id?: string; // A veces el backend usa id, a veces _id
  nombreFantasia: string;
  razonSocial: string;
  cuit: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  pais_id?: string;
  categoriaAfip?: CategoriaAfip | string; // Puede ser objeto populado o solo el ID
  rubro?: Rubro | string; // Puede ser objeto populado o solo el ID
  image?: string | File;
  active?: boolean;
  status?: string;
  filename?: string; // Para manejar el nombre de archivo antiguo en actualizaciones
  createdAt?: string;
  updatedAt?: string;
}

