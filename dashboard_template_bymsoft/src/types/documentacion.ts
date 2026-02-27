/**
 * @file documentacion.ts
 * @description Define la interfaz para el objeto Documento (plantilla).
 * @version 1.0
 * @date 25/12/2025
 */

export interface Documento {
  _id: string;
  id?: string;
  nombre: string;
  etiqueta: string;
  url: string; // URL al archivo en S3 o similar
  createdAt?: string;
  updatedAt?: string;
}