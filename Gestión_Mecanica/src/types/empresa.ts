/**
 * @file empresa.ts
 * @description Tipos e interfaces para Datos de la Empresa - Corresponde con Empresa.java
 * @version 2.0
 * @date 11/03/2026
 */

/**
 * Interfaz para la Empresa
 * Corresponde exactamente con la entidad Empresa.java del backend.
 */

export interface Empresa {
  id: 1;
  razonSocial: string;
  datosFiscal: string;
  telefono: string;
  email: string;
  ciudad: string;
  provincia: string;
  dirección: string;
  categoriaFiscal: string;
  logoPath: string;
}

export interface UpdateEmpresaRequest {
  razonSocial?: string;
  datosFiscal?: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  provincia?: string;
  dirección?: string;
  categoriaFiscal?: string;
  logoPath?: string;
}
