import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import { Cliente } from "../types/cliente";

/**
 * @file clienteApi.ts
 * @description Funciones para interactuar con la API de Clientes.
 * @version 2.1 (Mock Mode - Original code commented)
 * @date 04/02/2026
 */

/*
// ===== CÓDIGO ORIGINAL (COMENTADO) - PARA USO FUTURO =====
// Este código original usa axios y API_ENDPOINTS para consumir servicios reales
// Descomenta estas funciones cuando conectes a un backend real

/**
 * Obtiene la lista de clientes.
 * @param params - Parámetros opcionales de la consulta, como { active: true } para filtrar solo activos.
 * @returns Una promesa que se resuelve en un array de Clientes.
 */
/*
export async function obtenerClientes(
  params?: Record<string, any>
): Promise<Cliente[]> {
  // Evitar respuestas 304 (Not Modified) por cache del navegador/ CDN:
  // - Añadimos un parámetro timestamp para forzar una URL única
  // - Indicamos header Cache-Control: no-cache para pedir versión fresca
  const mergedParams = { ...(params || {}), _t: Date.now() };
  const { data } = await axiosInstance.get(API_ENDPOINTS.CLIENTES.LIST, {
    params: mergedParams,
    headers: { "Cache-Control": "no-cache" },
  });
  return data;
}
*/

/**
 * Obtiene clientes filtrados por documentación.
 * @returns Una promesa que se resuelve en un array de Clientes.
 */
/*
export async function obtenerClientesConDocumentacion(): Promise<Cliente[]> {
  const { data } = await axiosInstance.get(
    `${API_ENDPOINTS.CLIENTES.LIST}?filter=docs&doc=true`
  );
  return data;
}
*/

/**
 * Obtiene la documentación técnica de un cliente específico.
 * @param _id - El ID del cliente.
 * @returns Una promesa con la documentación del cliente.
 */
/*
export async function obtenerDocumentacionPorCliente(
  _id: string
): Promise<any> {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.DOCUMENTOS_TECNICOS.BY_CLIENT(_id)
  );
  return data;
}
*/

/**
 * Obtiene un cliente específico por su ID.
 * @param id - El ID del cliente.
 * @returns Una promesa que se resuelve con el cliente.
 */
/*
export async function obtenerClientePorId(id: string): Promise<Cliente> {
  const { data } = await axiosInstance.get(API_ENDPOINTS.CLIENTES.GET(id));
  return data;
}
*/

/**
 * Crea un nuevo cliente.
 * @param payload - Un objeto parcial de Cliente con los datos a crear.
 * @returns Una promesa que se resuelve con el cliente creado.
 */
/*
export async function crearCliente(
  payload: Partial<Cliente>
): Promise<Cliente> {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  }
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.CLIENTES.CREATE,
    formData
  );
  return data;
}
*/

/**
 * Elimina un cliente por su ID.
 * @param id - El ID del cliente a eliminar.
 */
/*
export async function eliminarCliente(id: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.CLIENTES.DELETE(id));
}
*/

/**
 * Actualiza un cliente existente.
 * @param id - El ID del cliente a actualizar.
 * @param payload - Un objeto parcial de Cliente con los datos a actualizar.
 * @returns Una promesa que se resuelve con el cliente actualizado.
 */
/*
export async function actualizarCliente(
  id: string,
  payload: Partial<Cliente>
): Promise<Cliente> {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      const formKey = key === "filename" ? "oldfilename" : key;
      formData.append(formKey, value as string | Blob);
    }
  }

  const { data } = await axiosInstance.put(
    API_ENDPOINTS.CLIENTES.UPDATE(id),
    formData
  );
  return data;
}
*/

/**
 * Actualiza solo el estado (activo/inactivo) de un cliente.
 * @param id - El ID del cliente.
 * @param active - El nuevo estado.
 * @returns Una promesa que se resuelve con el cliente actualizado.
 */
/*
export async function actualizarEstadoCliente({
  id,
  active,
}: {
  id: string;
  active: boolean;
}): Promise<Cliente> {
  const { data } = await axiosInstance.put(API_ENDPOINTS.CLIENTES.UPDATE(id), {
    active,
  });
  return data;
}
*/

/**
 * Desactiva un cliente (equivalente a un borrado lógico).
 * @param id - El ID del cliente a desactivar.
 * @returns Una promesa que se resuelve con el cliente actualizado.
 */
/*
export async function desactivarCliente(id: string): Promise<Cliente> {
  const { data } = await axiosInstance.patch(
    API_ENDPOINTS.CLIENTES.UPDATE(id), // PATCH usa la misma URL que PUT en este caso
    {
      active: false,
    }
  );
  return data;
}
*/

/**
 * Reenvía el email de activación para un cliente (backend espera { clienteId })
 * @param clienteId - el ID del cliente a desactivar.
 * @returns Una promesa que se resuelve con la respuesta del servidor.
 */
/*
export async function reenviarActivacion(clienteId: string): Promise<any> {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.CLIENTES.RESEND_ACTIVATION_MAIL,
    { clienteId }
  );
  return data;
}
*/

// ===== FIN DEL CÓDIGO ORIGINAL COMENTADO =====

// Datos simulados de clientes
const mockClientes: Cliente[] = [
  {
    id: "1",
    nombreFantasia: "Empresa Ejemplo S.A.",
    razonSocial: "Empresa Ejemplo Sociedad Anónima",
    cuit: "30-12345678-9",
    email: "contacto@empresa-ejemplo.com",
    telefono: "+54 11 1234-5678",
    direccion: "Av. Siempre Viva 123",
    ciudad: "Buenos Aires",
    provincia: "Buenos Aires",
    pais_id: "1",
    categoriaAfip: "Monotributista",
    rubro: "Tecnología",
    image: null,
    active: true,
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 días atrás
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    nombreFantasia: "Cliente Demo Ltda.",
    razonSocial: "Cliente Demo Limitada",
    cuit: "30-87654321-0",
    email: "info@cliente-demo.com",
    telefono: "+54 11 8765-4321",
    direccion: "Calle Falsa 456",
    ciudad: "Córdoba",
    provincia: "Córdoba",
    pais_id: "1",
    categoriaAfip: "Responsable Inscripto",
    rubro: "Consultoría",
    image: null,
    active: true,
    status: "active",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Obtiene la lista de clientes (simulado).
 * @param params - Parámetros opcionales de la consulta.
 * @returns Una promesa que se resuelve en un array de Clientes.
 */
export async function obtenerClientes(
  params?: Record<string, any>,
): Promise<Cliente[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  let clientes = [...mockClientes];

  // Aplicar filtros simulados
  if (params?.active !== undefined) {
    clientes = clientes.filter((c) => c.active === params.active);
  }

  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    clientes = clientes.filter(
      (c) =>
        c.nombreFantasia.toLowerCase().includes(searchTerm) ||
        c.razonSocial.toLowerCase().includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm),
    );
  }

  return clientes;
}

/**
 * Obtiene clientes filtrados por documentación (simulado).
 * @returns Una promesa que se resuelve en un array de Clientes.
 */
export async function obtenerClientesConDocumentacion(): Promise<Cliente[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 250));

  // Simular que algunos clientes tienen documentación
  return mockClientes.filter(() => Math.random() > 0.5);
}

/**
 * Obtiene la documentación técnica de un cliente específico (simulado).
 * @param _id - El ID del cliente.
 * @returns Una promesa con la documentación del cliente.
 */
export async function obtenerDocumentacionPorCliente(
  _id: string,
): Promise<any> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Simular documentación
  return {
    documentos: [
      {
        id: "1",
        nombre: "Certificado ISO 9001",
        fecha: new Date().toISOString(),
      },
      {
        id: "2",
        nombre: "Manual de Procedimientos",
        fecha: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Obtiene un cliente específico por su ID (simulado).
 * @param id - El ID del cliente.
 * @returns Una promesa que se resuelve con el cliente.
 */
export async function obtenerClientePorId(id: string): Promise<Cliente> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Buscar el cliente
  const cliente = mockClientes.find((c) => c.id === id);
  if (!cliente) {
    throw new Error("Cliente no encontrado");
  }

  return { ...cliente };
}

/**
 * Crea un nuevo cliente (simulado).
 * @param payload - Un objeto parcial de Cliente con los datos a crear.
 * @returns Una promesa que se resuelve con el cliente creado.
 */
export async function crearCliente(
  payload: Partial<Cliente>,
): Promise<Cliente> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Crear nuevo cliente
  const nuevoCliente: Cliente = {
    id: Date.now().toString(),
    nombreFantasia: payload.nombreFantasia || "",
    razonSocial: payload.razonSocial || "",
    cuit: payload.cuit || "",
    email: payload.email || "",
    telefono: payload.telefono || "",
    direccion: payload.direccion || "",
    ciudad: payload.ciudad || "",
    provincia: payload.provincia || "",
    pais_id: payload.pais_id || "1",
    categoriaAfip: payload.categoriaAfip || "Monotributista",
    rubro: payload.rubro || "General",
    image: payload.image || null,
    active: payload.active !== undefined ? payload.active : true,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Agregar a la lista simulada
  mockClientes.push(nuevoCliente);

  return { ...nuevoCliente };
}

/**
 * Elimina un cliente por su ID (simulado).
 * @param id - El ID del cliente a eliminar.
 */
export async function eliminarCliente(id: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Encontrar y eliminar el cliente
  const index = mockClientes.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Cliente no encontrado");
  }

  mockClientes.splice(index, 1);
}

/**
 * Actualiza un cliente existente (simulado).
 * @param id - El ID del cliente a actualizar.
 * @param payload - Un objeto parcial de Cliente con los datos a actualizar.
 * @returns Una promesa que se resuelve con el cliente actualizado.
 */
export async function actualizarCliente(
  id: string,
  payload: Partial<Cliente>,
): Promise<Cliente> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Encontrar y actualizar el cliente
  const index = mockClientes.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Cliente no encontrado");
  }

  // Actualizar el cliente
  mockClientes[index] = {
    ...mockClientes[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  return { ...mockClientes[index] };
}

/**
 * Actualiza solo el estado (activo/inactivo) de un cliente (simulado).
 * @param id - El ID del cliente.
 * @param active - El nuevo estado.
 * @returns Una promesa que se resuelve con el cliente actualizado.
 */
export async function actualizarEstadoCliente({
  id,
  active,
}: {
  id: string;
  active: boolean;
}): Promise<Cliente> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  return actualizarCliente(id, { active });
}

/**
 * Desactiva un cliente (simulado).
 * @param id - El ID del cliente a desactivar.
 * @returns Una promesa que se resuelve con el cliente actualizado.
 */
export async function desactivarCliente(id: string): Promise<Cliente> {
  return actualizarEstadoCliente({ id, active: false });
}

/**
 * Reenvía el email de activación para un cliente (simulado).
 * @param clienteId - el ID del cliente.
 * @returns Una promesa que se resuelve con la respuesta del servidor.
 */
export async function reenviarActivacion(clienteId: string): Promise<any> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simular envío exitoso
  console.log(`Mock: Email de activación reenviado para cliente ${clienteId}`);

  return {
    success: true,
    message: "Email de activación reenviado exitosamente",
  };
}

const clienteApi = {
  obtenerClientes,
  obtenerClientesConDocumentacion,
  obtenerDocumentacionPorCliente,
  obtenerClientePorId,
  crearCliente,
  eliminarCliente,
  actualizarCliente,
  actualizarEstadoCliente,
  desactivarCliente,
  reenviarActivacion,
};

export default clienteApi;
