import { Cliente } from "./cliente";
import { Documento } from "./documentacion";
import { User } from "./index"; // Asumiendo que el técnico es un usuario

/**
 * @file documentoTecnico.ts
 * @description Define la interfaz para un Documento Técnico, que es una plantilla de documento asignada a un cliente.
 * @version 1.0
 * @date 25/12/2025
 */

export interface DocumentoTecnico {
  _id: string;
  id?: string;
  cliente: Cliente | string; // ID o objeto populado
  documento: Documento | string; // ID o objeto populado de la plantilla original
  tecnico?: User | string; // ID o objeto populado del técnico que lo gestiona
  url: string; // URL al archivo específico para esta asignación
  estado?: "Pendiente" | "Aprobado" | "Rechazado" | "Vencido";
  fechaVencimiento?: string;
  createdAt?: string;
  updatedAt?: string;
}
