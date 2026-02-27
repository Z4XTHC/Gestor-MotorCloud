# Módulo de Notificaciones

Este módulo implementa un sistema completo de notificaciones en tiempo real para el sistema MangoSoft.

## 📋 Componentes

### 1. **NotificacionesListNew.tsx** (Principal)

Componente de lista principal con todas las funcionalidades.

**Características:**

### Características Principales

✅ **Lista de notificaciones** con datos del usuario autenticado  
✅ **Filtros dinámicos** por tipo (info, warning, error, success) y estado (leídas/no leídas)  
✅ **Marcar como leída** individualmente (⚠️ no reversible)  
✅ **Marcar todas como leídas** con un solo click (operación optimizada con endpoint del backend)  
✅ **Eliminar notificaciones** con confirmación SweetAlert2  
✅ **Modal de detalles** con información completa  
✅ **Badge contador** de notificaciones no leídas  
✅ **Auto-actualización** cada 30 segundos (polling)  
✅ **Fechas relativas** ("Hace X minuto/hora/día/semana")  
✅ **Integración con CacheContext** (5 minutos de TTL)  
✅ **Diseño responsivo** con dark mode  
✅ **Íconos de tipo** visuales (Info, Warning, Error, Success)  
✅ **Auto-eliminación backend** de notificaciones mayores a 31 días  
✅ **Javadoc completo** en todas las funciones

**Estados:**

```typescript
- notificaciones: Notificacion[]
- loading: boolean
- selectedNotificacion: Notificacion | null (modal detalles)
- tipoFilter: "all" | "info" | "warning" | "error" | "success"
- leidaFilter: "all" | "leidas" | "noLeidas"
```

**Funciones principales:**

- `fetchNotificaciones()`: Obtiene notificaciones (API o caché)
- `filteredNotificaciones`: Filtra por tipo y estado
- `contadorNoLeidas`: Cuenta notificaciones no leídas
- `getTipoIcon(tipo)`: Retorna ícono según tipo
- `getTipoColor(tipo)`: Retorna clases CSS según tipo
- `toggleLeida(notificacion)`: Marca/desmarca como leída
- `marcarTodasLeidas()`: Marca todas las no leídas como leídas
- `handleDelete(id)`: Elimina notificación con confirmación
- `formatFechaRelativa(date)`: Formatea fecha relativa

---

### 2. **NotificacionesDetalles.tsx** (Modal)

Modal solo lectura para visualizar información completa.

**Secciones:**

1. **Header:**
   - Título
   - Badge de tipo (info, warning, error, success)
   - Estado (leída/no leída)

2. **Contenido:**
   - Texto descriptivo completo
   - Enlace relacionado (si existe)

3. **Metadatos:**
   - Fecha de creación (formato local)
   - Última actualización (formato local)

4. **Acciones:**
   - Marcar como leída/no leída
   - Eliminar notificación
   - Cerrar modal

**Props:**

- `notificacion`: Notificación a mostrar
- `onClose`: Callback para cerrar modal
- `onToggleLeida`: Callback para marcar/desmarcar como leída
- `onDelete`: Callback para eliminar

---

## 🔄 Integración con Caché

El módulo utiliza `CacheContext` para optimizar peticiones:

```typescript
// Al cargar notificaciones
const cachedNotificaciones = getNotificaciones();
if (cachedNotificaciones && isCacheValid("notificaciones")) {
  setNotificaciones(cachedNotificaciones); // Usa caché
} else {
  // Fetch desde API y guarda en caché
  setNotificaciones(await API.get());
  setCacheNotificaciones(data);
}

// Al mutar (marcar leída/eliminar)
clearNotificaciones(); // Invalida caché
fetchNotificaciones(); // Recarga desde API
```

**Tiempo de vida del caché:** 5 minutos (configurable)

---

## �️ API Endpoints

El módulo consume los siguientes endpoints del backend:

```typescript
NOTIFICACIONES: {
  LIST: "/api/notificaciones",                           // GET - Lista notificaciones del usuario
  MARCAR_LEIDA: (id) => `/api/notificaciones/${id}/leer`, // PUT - Marca como leída
  MARCAR_TODAS_LEIDAS: "/api/notificaciones/leer-todas",  // PUT - Marca todas como leídas
  DELETE: (id) => `/api/notificaciones/${id}`,            // DELETE - Elimina notificación
  COUNT_NO_LEIDAS: "/api/notificaciones/no-leidas/count", // GET - Contador de no leídas
}
```

**⚠️ Nota importante:** El backend solo permite **marcar como leída**, no desmarcar. Una vez que una notificación se marca como leída, permanece en ese estado.

**Payload de UPDATE:**

```json
{
  "leida": true // o false
}
```

---

## 🗂️ Tipos TypeScript

### Notificacion

```typescript
export interface Notificacion {
  _id?: string;
  id?: string;
  user_id?: string; // ID del usuario propietario
  textoDescriptivo: string; // Mensaje de la notificación
  leida: boolean; // Estado de lectura
  tipo?: "info" | "warning" | "error" | "success"; // Tipo (opcional)
  link?: string; // URL relacionada (opcional)
  createdAt?: string; // Fecha de creación
  updatedAt?: string; // Fecha de actualización
}
```

---

## 🎨 Diseño y UX

### Tipos de Notificación

| Tipo      | Color    | Ícono            | Uso                  |
| --------- | -------- | ---------------- | -------------------- |
| `info`    | Azul     | ℹ️ Info          | Información general  |
| `success` | Verde    | ✅ CheckCircle   | Operaciones exitosas |
| `warning` | Amarillo | ⚠️ AlertTriangle | Advertencias         |
| `error`   | Rojo     | ⛔ AlertCircle   | Errores críticos     |

### Estados Visuales

- **No leída**:
  - Fondo destacado (`bg-primary-lighter/20`)
  - Borde coloreado (`border-primary/30`)
  - Texto en negrita
  - Badge con contador

- **Leída**:
  - Fondo blanco/gris
  - Opacidad reducida (70%)
  - Texto normal
  - Sin badge

### Formato de Fechas

```typescript
- "Hace un momento" (< 1 minuto)
- "Hace X minuto(s)" (< 1 hora)
- "Hace X hora(s)" (< 24 horas)
- "Hace X día(s)" (< 7 días)
- "Hace X semana(s)" (< 31 días)
- "15 may 2023" (> 31 días)
```

---

## ⏱️ Notificaciones en Tiempo Real

### Polling (Implementado)

```typescript
useEffect(() => {
  fetchNotificaciones(); // Carga inicial

  // Polling cada 30 segundos
  const interval = setInterval(() => {
    fetchNotificaciones();
  }, 30000);

  return () => clearInterval(interval); // Cleanup
}, []);
```

### WebSocket (Futuro)

Para implementar WebSocket en lugar de polling:

```typescript
// En useEffect
const ws = new WebSocket("wss://api.MangoSoft.com/notifications");

ws.onmessage = (event) => {
  const nuevaNotificacion = JSON.parse(event.data);
  setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
  // Mostrar toast/snackbar
};

return () => ws.close();
```

---

## 🔔 Badge de Contador (No leídas)

El contador se calcula dinámicamente:

```typescript
const contadorNoLeidas = notificaciones.filter((n) => !n.leida).length;
```

Para mostrar en Header/Sidebar:

```tsx
{
  contadorNoLeidas > 0 && (
    <span className="bg-coral text-white px-2 py-1 rounded-full text-xs">
      {contadorNoLeidas}
    </span>
  );
}
```

---

## 🚀 Uso del Módulo

### Importar en App.tsx o Router

```typescript
import { NotificacionesList } from "./pages/notificaciones/NotificacionesList";

// En tus rutas
<Route path="/notificaciones" element={<NotificacionesList />} />;
```

### Estructura de archivos

```
src/pages/notificaciones/
├── NotificacionesList.tsx       (Re-export del nuevo componente)
├── NotificacionesListNew.tsx    (Principal - 700+ líneas)
├── NotificacionesDetalles.tsx   (Modal - 220+ líneas)
└── README.md                    (Esta documentación)
```

---

## ✅ Checklist de Funcionalidades

- [x] Lista con datos de API
- [x] Filtros por tipo (info, warning, error, success)
- [x] Filtros por estado (leídas/no leídas)
- [x] Marcar como leída individualmente (⚠️ no reversible)
- [x] Marcar todas como leídas (optimizado con endpoint del backend)
- [x] Eliminar con confirmación
- [x] Ver detalles en modal
- [x] Actualización automática (polling 30s)
- [x] Badge con contador de no leídas
- [x] Integración con caché
- [x] Skeleton loaders
- [x] Formato de fecha relativa
- [x] Manejo de errores
- [x] TypeScript strict mode
- [x] Diseño responsivo
- [x] Dark mode support
- [x] Javadoc completo
- [x] Cierre con ESC en modales
- [x] Click fuera cierra modales
- [x] Endpoint GET para contador de no leídas disponible

---

## 🔧 Mejoras Futuras

- [ ] WebSocket para notificaciones en tiempo real (reemplazar polling)
- [ ] Snackbar/Toast al recibir nueva notificación
- [ ] Sonido opcional al recibir notificación
- [ ] Exportar notificaciones a CSV
- [ ] Búsqueda por texto en notificaciones
- [ ] Paginación (backend + frontend)
- [ ] Notificaciones push (PWA)
- [ ] Configuración de preferencias de notificación
- [ ] Agrupar notificaciones similares
- [ ] Vista de timeline
- [ ] Archivar notificaciones (soft delete)

---

## 🐛 Notas Técnicas

1. **Auto-eliminación backend**: Las notificaciones mayores a 31 días se eliminan automáticamente en el backend
2. **Polling interval**: 30 segundos por defecto, ajustable en el código
3. **Cache TTL**: 5 minutos, configurable en `CacheContext`
4. **IDs**: Soporta tanto `_id` (MongoDB) como `id` (genérico)
5. **Tipo opcional**: Si el campo `tipo` no existe, se usa "info" por defecto
6. **Contador badge**: Se actualiza en tiempo real con cada fetch

---

## 📱 Integración con Header/Sidebar

Para mostrar el badge de contador en el menú:

```tsx
// En Header.tsx o Sidebar.tsx
import { useCache } from "../../contexts/CacheContext";

const { getNotificaciones } = useCache();
const notificaciones = getNotificaciones() || [];
const contadorNoLeidas = notificaciones.filter((n) => !n.leida).length;

// En el link de notificaciones
<Link to="/notificaciones">
  <Bell />
  <span>Notificaciones</span>
  {contadorNoLeidas > 0 && <span className="badge">{contadorNoLeidas}</span>}
</Link>;
```

---

**Última actualización:** 12 de noviembre de 2025
**Autor:** GitHub Copilot
**Versión:** 1.0.0
