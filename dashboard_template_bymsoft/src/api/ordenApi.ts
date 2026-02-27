import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import {
  Orden,
  CrearOrdenPayload,
  ActualizarOrdenPayload,
} from "../types/orden";

/**
 * @file ordenApi.ts
 * @description Funciones para interactuar con la API de Órdenes de Trabajo.
 * @version 2.1 (Mock Mode - Original code commented)
 * @date 04/02/2026
 */

/*
// ===== CÓDIGO ORIGINAL (COMENTADO) - PARA USO FUTURO =====
// Este código original usa axios y API_ENDPOINTS para consumir servicios reales
// Descomenta estas funciones cuando conectes a un backend real

import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";

/**
 * Obtiene una lista de todas las órdenes de trabajo.
 * @returns Una promesa que se resuelve en un array de Órdenes.
 */
/*
export async function obtenerOrdenes(): Promise<Orden[]> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDENES.LIST);
  return data;
}
*/

/**
 * Obtiene una orden de trabajo específica por su ID.
 * @param id - El ID de la orden.
 * @returns Una promesa que se resuelve con los datos de la Orden.
 */
/*
export async function obtenerOrdenPorId(id: string): Promise<Orden> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDENES.GET(id));
  return data;
}
*/

/**
 * Obtiene todas las órdenes de trabajo de un cliente específico.
 * @param clienteId - El ID del cliente.
 * @returns Una promesa que se resuelve con un array de Órdenes.
 */
/*
export async function obtenerOrdenesPorCliente(
  clienteId: string
): Promise<Orden[]> {
  const { data } = await axiosInstance.get(
    `${API_ENDPOINTS.ORDENES.LIST}?cliente_id=${clienteId}`
  );
  return data;
}
*/

/**
 * Exporta las órdenes de un cliente a un archivo.
 * @param clienteId - El ID del cliente.
 * @returns Una promesa que se resuelve con el archivo en formato Blob.
 */
/*
export async function exportarOrdenesPorCliente(
  clienteId: string
): Promise<Blob> {
  const { data } = await axiosInstance.get(
    `${API_ENDPOINTS.ORDENES.EXPORT}?cliente_id=${clienteId}`,
    { responseType: 'blob' }
  );
  return data;
}
*/

/**
 * Obtiene las estadísticas para el dashboard.
 * @returns Una promesa que se resuelve con los datos de las estadísticas.
 */
/*
export async function obtenerEstadisticasDashboard(): Promise<any> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS);
  return data;
}
*/

/**
 * Crea una nueva orden de trabajo.
 * @param payload - Objeto con los datos de la orden a crear.
 * @returns Una promesa que se resuelve con la orden creada.
 */
/*
export async function crearOrden(payload: CrearOrdenPayload): Promise<Orden> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.ORDENES.CREATE,
    payload
  );
  return data;
}
*/

/**
 * Actualiza una orden de trabajo existente.
 * @param id - El ID de la orden a actualizar.
 * @param payload - Objeto con los datos a modificar.
 * @returns Una promesa que se resuelve con la orden actualizada.
 */
/*
export async function actualizarOrden(
  id: string,
  payload: ActualizarOrdenPayload
): Promise<Orden> {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.ORDENES.UPDATE(id),
    payload
  );
  return data;
}
*/

/**
 * Elimina una orden de trabajo por su ID.
 * @param id - El ID de la orden a eliminar.
 */
/*
export async function eliminarOrden(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.ORDENES.DELETE(id));
}
*/

// ===== FIN DEL CÓDIGO ORIGINAL COMENTADO =====

// Datos simulados de órdenes
const mockOrdenes: Orden[] = [
  {
    id: "1",
    numeroorden: "ORD-001",
    tipoOrden_id: "1",
    sucursal_id: "1",
    cliente_id: "1",
    fechainicio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días atrás
    fechafin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días adelante
    fechavencimiento: new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 10 días adelante
  },
  {
    id: "2",
    numeroorden: "ORD-002",
    tipoOrden_id: "2",
    sucursal_id: "1",
    cliente_id: "1",
    fechainicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
    fechafin: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 días adelante
    fechavencimiento: new Date(
      Date.now() + 15 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 15 días adelante
  },
  {
    id: "3",
    numeroorden: "ORD-003",
    tipoOrden_id: "1",
    sucursal_id: "2",
    cliente_id: "2",
    fechainicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 días atrás
    fechafin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás (completada)
    fechavencimiento: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 5 días atrás
  },
];

/**
 * Obtiene una lista de todas las órdenes de trabajo (simulado).
 * @returns Una promesa que se resuelve en un array de Órdenes.
 */
export async function obtenerOrdenes(): Promise<Orden[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Retornar copia de los datos simulados
  return [...mockOrdenes];
}

/**
 * Obtiene una orden de trabajo específica por su ID (simulado).
 * @param id - El ID de la orden.
 * @returns Una promesa que se resuelve con los datos de la Orden.
 */
export async function obtenerOrdenPorId(id: string): Promise<Orden> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Buscar la orden
  const orden = mockOrdenes.find((o) => o.id === id);
  if (!orden) {
    throw new Error("Orden no encontrada");
  }

  return { ...orden };
}

/**
 * Obtiene todas las órdenes de trabajo de un cliente específico (simulado).
 * @param clienteId - El ID del cliente.
 * @returns Una promesa que se resuelve con un array de Órdenes.
 */
export async function obtenerOrdenesPorCliente(
  clienteId: string,
): Promise<Orden[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 250));

  // Filtrar órdenes por cliente
  return mockOrdenes.filter((o) => o.cliente_id === clienteId);
}

/**
 * Exporta las órdenes de un cliente a un archivo (simulado).
 * @param clienteId - El ID del cliente.
 * @returns Una promesa que se resuelve con el archivo en formato Blob.
 */
export async function exportarOrdenesPorCliente(
  clienteId: string,
): Promise<Blob> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simular creación de archivo Excel
  const csvContent =
    "id,numeroorden,tipoOrden_id,sucursal_id,cliente_id,fechainicio,fechafin,fechavencimiento\n" +
    mockOrdenes
      .filter((o) => o.cliente_id === clienteId)
      .map(
        (o) =>
          `${o.id},${o.numeroorden},${o.tipoOrden_id},${o.sucursal_id},${o.cliente_id},${o.fechainicio},${o.fechafin || ""},${o.fechavencimiento || ""}`,
      )
      .join("\n");

  return new Blob([csvContent], { type: "text/csv" });
}

/**
 * Obtiene las estadísticas para el dashboard (simulado).
 * @returns Una promesa que se resuelve con los datos de las estadísticas.
 */
export async function obtenerEstadisticasDashboard(): Promise<any> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Calcular estadísticas simuladas
  const totalOrdenes = mockOrdenes.length;
  const ordenesCompletadas = mockOrdenes.filter(
    (o) => o.fechafin && new Date(o.fechafin) < new Date(),
  ).length;
  const ordenesPendientes = totalOrdenes - ordenesCompletadas;
  const ordenesEnProceso = Math.floor(ordenesPendientes * 0.7);

  return {
    totalOrdenes,
    ordenesPendientes,
    ordenesEnProceso,
    ordenesCompletadas,
    totalClientes: 2,
    totalEmpleados: 5,
    capacitacionesMes: 3,
    alertas: 1,
  };
}

/**
 * Crea una nueva orden de trabajo (simulado).
 * @param payload - Objeto con los datos de la orden a crear.
 * @returns Una promesa que se resuelve con la orden creada.
 */
export async function crearOrden(payload: CrearOrdenPayload): Promise<Orden> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Crear nueva orden
  const nuevaOrden: Orden = {
    id: Date.now().toString(),
    numeroorden: `ORD-${Date.now().toString().slice(-3)}`,
    ...payload,
  };

  // Agregar a la lista simulada
  mockOrdenes.push(nuevaOrden);

  return { ...nuevaOrden };
}

/**
 * Actualiza una orden de trabajo existente (simulado).
 * @param id - El ID de la orden a actualizar.
 * @param payload - Objeto con los datos a modificar.
 * @returns Una promesa que se resuelve con la orden actualizada.
 */
export async function actualizarOrden(
  id: string,
  payload: ActualizarOrdenPayload,
): Promise<Orden> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Encontrar y actualizar la orden
  const index = mockOrdenes.findIndex((o) => o.id === id);
  if (index === -1) {
    throw new Error("Orden no encontrada");
  }

  // Actualizar la orden
  mockOrdenes[index] = {
    ...mockOrdenes[index],
    ...payload,
  };

  return { ...mockOrdenes[index] };
}

/**
 * Elimina una orden de trabajo por su ID (simulado).
 * @param id - El ID de la orden a eliminar.
 */
export async function eliminarOrden(id: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Encontrar y eliminar la orden
  const index = mockOrdenes.findIndex((o) => o.id === id);
  if (index === -1) {
    throw new Error("Orden no encontrada");
  }

  mockOrdenes.splice(index, 1);
}
