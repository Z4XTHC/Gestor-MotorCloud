# Módulo de Clientes - Arquitectura Refactorizada

## 📁 Estructura de Componentes

El módulo de clientes ha sido refactorizado desde un único archivo monolítico de **957 líneas** a una arquitectura modular compuesta por **4 componentes separados** con responsabilidades únicas.

### Componentes

#### 1. **ClientesListNew.tsx** (465 líneas)

**Responsabilidad:** Componente principal - Vista y gestión de la lista de clientes

**Estado:**

- `clientes[]` - Array de clientes obtenidos del backend
- `rubros[]` - Array de rubros para filtros
- `loading` - Estado de carga
- `search` - Búsqueda por texto
- `rubroFilter` - Filtro por rubro
- `estadoFilter` - Filtro por estado (activo/inactivo)
- `selectedCliente` - Cliente seleccionado para ver detalles
- `editingCliente` - Cliente en edición
- `currentPage, itemsPerPage` - Estado de paginación
- `sortField, sortDirection` - Estado de ordenamiento

**Características:**

- Integración con caché (CacheContext)
- Tabla con columnas ordenables (Razón Social, Rubro, CUIT, Fecha de Alta, Estado)
- Sistema de filtros: búsqueda por texto, por rubro, por estado
- Paginación completa (5/10/15/20/25 items por página)
- Ordenamiento multi-columna con indicadores visuales
- Acciones por fila: Ver detalles, Editar, Eliminar

**Funciones principales:**

- `fetchClientes()` - Obtiene clientes desde API con caché
- `fetchRubros()` - Obtiene rubros para filtros
- `handleSort(field)` - Gestiona ordenamiento de columnas
- `handleDelete(id)` - Delega eliminación a confirmarEliminarCliente
- `handleEditFromDetails(cliente)` - Cierra modal de detalles y abre edición

---

#### 2. **ClientesDetalles.tsx** (175 líneas)

**Responsabilidad:** Modal de solo lectura para visualización completa de datos del cliente

**Props:**

```typescript
interface ClientesDetallesProps {
  cliente: Cliente | null;
  onClose: () => void;
  onEdit?: (cliente: Cliente) => void;
}
```

**Características:**

- Modal overlay con backdrop semitransparente
- Muestra imagen/logo del cliente (o inicial si no tiene)
- Información completa: CUIT, Rubro, Email, Teléfono, Categoría AFIP, Estado, Dirección, Fecha de registro
- Badge visual de estado (activado/sin activar)
- Botón "Editar" opcional (si se provee onEdit)
- Formato de fechas en español (es-ES)

---

#### 3. **ClientesForm.tsx** (280 líneas)

**Responsabilidad:** Modal de formulario para editar clientes existentes

**Props:**

```typescript
interface ClientesFormProps {
  cliente: Cliente;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Campos del formulario:**

- Nombre Fantasía\* (text, requerido)
- Razón Social\* (text, requerido)
- CUIT\* (text, requerido)
- Email (email, opcional)
- Teléfono (text, opcional)
- Estado (select: Activado/Sin activar)
- Dirección (text, opcional)

**Validaciones:**

- Campos obligatorios: nombreFantasia, razonSocial, cuit
- Validación de formato email (HTML5)
- Estado sincronizado: `active` (boolean) y `status` (string)

**Flujo:**

1. Inicializa formulario con datos del cliente recibido
2. Usuario modifica campos
3. Al enviar: PUT a API con datos actualizados
4. Muestra confirmación con SweetAlert2
5. Invoca `onSuccess()` para recargar lista
6. Cierra modal automáticamente

---

#### 4. **ClientesConfirm.tsx** (47 líneas)

**Responsabilidad:** Helper function para confirmación y eliminación de clientes

**Exporta:**

```typescript
export const confirmarEliminarCliente = async (
  id: string,
  onSuccess: () => void
) => Promise<void>;
```

**Flujo:**

1. Muestra diálogo de confirmación con SweetAlert2
   - Título: "¿Estás seguro?"
   - Mensaje: "Esta acción no se puede deshacer"
   - Botones: "Sí, eliminar" / "Cancelar"
2. Si confirma:
   - DELETE request a `/api/clientes/${id}`
   - Muestra notificación de éxito (2s)
   - Invoca `onSuccess()` para recargar lista
3. Si hay error:
   - Muestra notificación de error
   - No invoca callback

---

## 🔄 Flujo de Datos

```
ClientesListNew (Estado principal)
    │
    ├─> fetchClientes() → API → setClientes() → Cache
    │
    ├─> Usuario click "Ver" → setSelectedCliente()
    │   └─> ClientesDetalles renderiza
    │       ├─> Usuario click "Cerrar" → onClose() → setSelectedCliente(null)
    │       └─> Usuario click "Editar" → onEdit(cliente)
    │           └─> handleEditFromDetails() → abre ClientesForm
    │
    ├─> Usuario click "Editar" → setEditingCliente()
    │   └─> ClientesForm renderiza
    │       ├─> Usuario modifica datos → setState local
    │       ├─> Usuario click "Guardar" → PUT API
    │       ├─> onSuccess() → fetchClientes() (recarga lista)
    │       └─> onClose() → setEditingCliente(null)
    │
    └─> Usuario click "Eliminar" → handleDelete(id)
        └─> confirmarEliminarCliente(id, fetchClientes)
            ├─> Muestra confirmación SweetAlert2
            ├─> DELETE API
            └─> onSuccess() → fetchClientes() (recarga lista)
```

---

## ✅ Beneficios de la Refactorización

### Antes (ClientesList.tsx - 957 líneas)

❌ Archivo monolítico difícil de mantener  
❌ Múltiples responsabilidades en un solo componente  
❌ Difícil de testear unitariamente  
❌ Duplicación de código entre modales  
❌ Hard to debug: mucho código para revisar

### Después (4 archivos modulares - 967 líneas totales)

✅ **Separación de responsabilidades** (SRP)  
✅ **Componentes reutilizables** (DRY)  
✅ **Fácil de testear** (cada componente independiente)  
✅ **Mejor mantenibilidad** (cambios localizados)  
✅ **Código más legible** (archivos < 500 líneas)  
✅ **Type-safe** (interfaces TypeScript bien definidas)  
✅ **Consistencia** (patrón replicable en otros módulos)

---

## 🔌 API Endpoints Utilizados

```typescript
// Listar clientes
GET /api/clientes
Response: Cliente[]

// Actualizar cliente
PUT /api/clientes/:id
Body: {
  nombreFantasia: string;
  razonSocial: string;
  cuit: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  active: boolean;
  status: string;
}

// Eliminar cliente
DELETE /api/clientes/:id

// Listar rubros (para filtros)
GET /api/rubros
Response: Rubro[]
```

---

## 🚀 Uso en Otros Componentes

### Importar y usar ClientesList

```typescript
import { ClientesList } from "./pages/clientes/ClientesListNew";

// En App.tsx
<Route path="/clientes" element={<ClientesList />} />;
```

### Usar componentes individuales (si necesario)

```typescript
import { ClientesDetalles } from "./pages/clientes/ClientesDetalles";
import { ClientesForm } from "./pages/clientes/ClientesForm";
import { confirmarEliminarCliente } from "./pages/clientes/ClientesConfirm";

// Ejemplo: modal de detalles standalone
<ClientesDetalles
  cliente={selectedCliente}
  onClose={() => setSelectedCliente(null)}
  onEdit={(c) => handleEdit(c)}
/>;
```

---

## 📋 Futuras Mejoras

1. **Optimización de rendimiento:**

   - Agregar `React.memo` a componentes modales
   - Usar `useMemo` para filtros y ordenamiento
   - Virtualización de tabla para grandes datasets

2. **Funcionalidad adicional:**

   - Export a Excel/PDF desde ClientesList
   - Crear cliente desde modal (no solo editar)
   - Búsqueda avanzada con múltiples criterios
   - Filtros guardados en localStorage

3. **Testing:**

   - Unit tests para cada componente
   - Integration tests para flujo completo
   - E2E tests con Playwright/Cypress

4. **Accesibilidad:**

   - ARIA labels en modales
   - Navegación por teclado mejorada
   - Focus trapping en modales
   - Screen reader optimization

5. **UI/UX:**
   - Skeleton loaders más detallados
   - Transiciones entre estados
   - Confirmaciones inline (no solo SweetAlert)
   - Drag & drop para ordenar columnas

---

## 📝 Notas de Implementación

- **Caché:** Se usa `CacheContext` para optimizar llamadas a la API
- **Formato de fechas:** Todas las fechas usan `toLocaleDateString('es-ES')`
- **Estados sincronizados:** `active` (boolean) y `status` (string "Activado"/"Sin activar")
- **IDs flexibles:** Componentes aceptan `_id` o `id` (compatibilidad MongoDB)
- **Dark mode:** Todos los componentes soportan tema oscuro
- **Responsive:** Diseño adaptable mobile-first

---

**Última actualización:** 9 de noviembre de 2025  
**Patrón replicado en:** Módulo de Órdenes (OrdenesListNew.tsx)
