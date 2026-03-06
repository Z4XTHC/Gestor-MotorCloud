/**
 * @file cliente.ts
 * @description Tipos e interfaces para Cliente - Corresponde con Cliente.java
 * @version 1.0
 * @date 28/02/2026 


/**
 * Interfaz para el Cliente
 * Corresponde exactamente con la entidad Cliente.java del backend
 */

export interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    dni: string;
    status: boolean;
}

export interface CreateClienteRequest {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    dni: string;
    status?: boolean;
}

export interface UpdateClienteRequest {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    dni?: string;
    status?: boolean;
}
