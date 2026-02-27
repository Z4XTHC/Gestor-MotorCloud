# Dashboard Template - React + TypeScript

Template de dashboard administrativo completo con diseño profesional, responsive y listo para personalización.

## Características Principales

### Diseño y Accesibilidad

- **Paleta de colores personalizada** con tonos verdes, naranjas y beige
- **Modo oscuro/claro** con toggle y persistencia en localStorage
- **Escalado de interfaz** en 3 tamaños (90%, 100%, 110%)
- **Responsive design** Mobile-First para todos los dispositivos
- **Navegación adaptativa**: Sidebar en desktop, Bottom navigation en móvil

### Autenticación y Seguridad

- Sistema de autenticación JWT con refresh tokens
- Auto-logout por inactividad (30 minutos)
- Rutas protegidas con redirección automática
- Interceptors de Axios para manejo de tokens
- Validación de formularios con React Hook Form

### Módulos del Template

#### 1. Dashboard Principal

- Métricas genéricas personalizables
- Acciones rápidas configurables
- Información del sistema

#### 2. Páginas de Ejemplo

- **Página de Ejemplo 1**: Cards y componentes básicos
- **Página de Ejemplo 2**: Botones y tablas
- **Página de Ejemplo 3**: Formularios

#### 3. Patrones de Componentes (Ejemplos Completos)

El template incluye **ejemplos completos** de patrones de UI comunes organizados por módulos:

##### 📁 **Estructura de Patrones**

```
src/pages/
├── clientes/           # Gestión de clientes
│   ├── ClientesListNew.tsx    # Tabla completa con CRUD
│   ├── ClientesDetalles.tsx   # Modal con detalles
│   ├── ClientesForm.tsx       # Modal con formulario
│   └── ClientesConfirm.tsx    # SweetAlert2 confirmaciones
├── notificaciones/     # Centro de notificaciones
├── tecnicos/          # Gestión de técnicos
├── usuarios/          # Gestión de usuarios
└── configuracion/     # Configuración del sistema
```

##### 🎯 **Patrones Disponibles**

###### **ListNew/List** - Tablas Completas

- **Tabla responsive** con TanStack Table
- **Paginación** y filtros
- **Acciones CRUD** (Crear, Leer, Actualizar, Eliminar)
- **Búsqueda** en tiempo real
- **Estados de carga** y manejo de errores

###### **Detalles** - Modales de Visualización

- **Modal centrado** con detalles completos
- **Información estructurada** en cards
- **Botones de acción** contextuales
- **Responsive** para móviles

###### **Form** - Formularios en Modal

- **Validación** con React Hook Form
- **Campos diversos**: texto, select, checkbox, file
- **Estados de carga** durante envío
- **Manejo de errores** visual

###### **Confirm** - Confirmaciones

- **SweetAlert2** para acciones críticas
- **Mensajes contextuales** según la acción
- **Confirmación/Cancelación** con callbacks
- **Estados de carga** durante procesamiento

##### 🚀 **Cómo Usar los Ejemplos**

1. **Explora** cada módulo para ver implementaciones completas
2. **Copia** los patrones a tus nuevos módulos
3. **Adapta** los estilos y lógica según tus necesidades
4. **Reutiliza** componentes comunes (Button, Input, Modal, etc.)

#### 5. Configuración

- Configuración general
- Perfil de usuario
- Información del sistema

#### 6. Empleados

- Gestión completa de personal
- Importación masiva desde Excel
- **Endpoints**:
  - `GET /api/empleados`
  - `POST /api/empleados`
  - `POST /api/empleados/upload-excel`

#### 7. Capacitaciones

- Programación de entrenamientos
- Upload de documentos PDF
- **Endpoints**:
  - `GET /api/capacitaciones`
  - `POST /api/capacitaciones`
  - `POST /api/capacitaciones/:id/upload-pdf`

#### 8. Documentación Técnica

- Biblioteca de documentos
- Asignación a clientes
- **Endpoints**:
  - `GET /api/documentacion`
  - `POST /api/documentacion/upload`

#### 9. Notificaciones

- Centro de notificaciones
- Estado leído/no leído
- **Endpoints**:
  - `GET /api/notificaciones?unread=true`
  - `PUT /api/notificaciones/:id/mark-read`

#### 10. Configuración

- Países, provincias, localidades
- Rubros y categorías AFIP
- Tipos de orden y técnicos
- **Endpoints**: Múltiples bajo `/api/config/*`

## Instalación

```bash
npm install
```

## Configuración

1. Copiar el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Configurar la URL del backend en `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Desarrollo

```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:5173`

## Producción

```bash
npm run build
npm run preview
```

## Estructura del Proyecto

```
src/
├── api/                    # Configuración de Axios
│   └── axiosConfig.ts      # Interceptors y manejo de tokens
├── components/             # Componentes reutilizables
│   ├── common/             # Botones, Inputs, Cards
│   ├── layout/             # Sidebar, Header, MainLayout
│   └── ProtectedRoute.tsx  # HOC para rutas protegidas
├── constants/              # Constantes y configuración
│   └── api.ts              # Endpoints del backend
├── contexts/               # Contextos de React
│   ├── AuthContext.tsx     # Autenticación y usuario
│   └── ThemeContext.tsx    # Tema y escalado
├── pages/                  # Páginas/vistas
│   ├── auth/               # Login, registro
│   ├── clientes/           # Gestión de clientes
│   ├── ordenes/            # Órdenes de servicio
│   ├── empleados/          # Gestión de empleados
│   ├── capacitaciones/     # Capacitaciones
│   ├── documentacion/      # Documentación técnica
│   ├── notificaciones/     # Centro de notificaciones
│   ├── configuracion/      # Configuración del sistema
│   └── Dashboard.tsx       # Dashboard principal
├── types/                  # TypeScript interfaces
│   └── index.ts            # Tipos y modelos de datos
└── App.tsx                 # Configuración de rutas
```

## Tecnologías

- **React 18** con TypeScript
- **Tailwind CSS** con configuración custom
- **React Router DOM** para navegación
- **Axios** para peticiones HTTP
- **React Hook Form** para formularios
- **SweetAlert2** para notificaciones
- **Lucide React** para iconos
- **TanStack Query** para cache de datos
- **TanStack Table** para tablas avanzadas

## Paleta de Colores

### Colores Principales

- **Primary**: `#F39F23` (Verde principal)
- **Primary Light**: `#84d4cc` (Verde claro)
- **Primary Lighter**: `#9fd9c5` (Verde muy claro)
- **Secondary**: `#f1a023` (Naranja)
- **Accent**: `#54ac4e` (Verde oscuro)

### Colores de Apoyo

- **Warm Light**: `#f8d2a6` (Beige claro - cards)
- **Warm Medium**: `#f6bf70` (Dorado - badges)
- **Coral**: `#f4ac9c` (Coral - alertas)
- **Neutral Light**: `#e2d4d8` (Rosa gris - bordes)
- **Background**: `#f3f2f3` (Gris claro - fondo)

### Modo Oscuro

- **Dark Primary**: `#84d4cc`
- **Dark BG**: `#1a1a1a`
- **Dark Surface**: `#2d2d2d`
- **Dark Text**: `#f3f2f3`

## Características Técnicas

### Manejo de Errores

- Interceptors de Axios para errores HTTP
- Retry automático en caso de fallo
- Notificaciones visuales con SweetAlert2
- Manejo de 401 con refresh token automático

### Rendimiento

- Debounced search para evitar spam de requests
- Server-side pagination
- Lazy loading de componentes
- Optimized re-renders

### Accesibilidad

- Contraste de colores WCAG AA compliant
- Navegación por teclado
- ARIA labels en todos los controles interactivos
- Focus visible en todos los elementos

### Seguridad

- Tokens JWT en localStorage
- Refresh tokens para sesiones largas
- Auto-logout por inactividad
- CSRF protection headers
- Input sanitization

## Modo Mock vs Producción

Este template incluye **dos modos de funcionamiento** para facilitar el desarrollo y la transición a producción:

### 🧪 Modo Mock (Actual)

Por defecto, el template funciona en **modo simulado** sin requerir backend:

- ✅ **Datos simulados** con delays realistas
- ✅ **Funciona sin servidor** backend
- ✅ **Todas las APIs** listas para usar
- ✅ **CRUD completo** en memoria
- ✅ **Autenticación mock** funcional

#### Credenciales para Login Mock

```
Email: admin@example.com
Password: 123456
```

### 🔄 Modo Producción (Código Original Comentado)

### 🔄 Modo Producción (Código Original Comentado)

Cuando conectes tu backend real:

1. **Descomenta** el código original en los archivos API:

   ```typescript
   // En src/api/*.ts
   // Descomenta las funciones comentadas que usan axiosInstance y API_ENDPOINTS
   // Comenta o elimina las funciones mock activas
   ```

2. **Archivos a modificar**:
   - `src/api/authApi.ts`
   - `src/api/clienteApi.ts`
   - `src/api/notificacionApi.ts`
   - `src/api/ordenApi.ts`
   - `src/api/userApi.ts`
   - `src/api/paisApi.ts`

3. **Configura las variables de entorno**:
   ```env
   VITE_API_BASE_URL=https://tu-api.com
   ```

### 📋 Estructura de APIs

Cada archivo API contiene:

- **Código original comentado** (para uso futuro)
- **Funciones mock activas** (funcionamiento actual)
- **Misma interfaz** para transición seamless

## Integración con Backend

El dashboard espera las siguientes respuestas del backend:

### Autenticación

```typescript
POST / api / auth / signin;
Response: {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "Admin" | "Técnico" | "Cliente";
  }
}
```

### Listados Paginados

```typescript
GET /api/clientes?page=1&limit=10&search=
Response: {
  data: Cliente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Errores

```typescript
Response (4xx/5xx): {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

## Guía de Desarrollo con Patrones

### 🎯 **Usando los Patrones como Ejemplos**

Los **patrones de componentes** incluidos sirven como **guías completas** para implementar funcionalidades comunes:

#### **1. Para Crear una Nueva Entidad**

```bash
# Copia la estructura de cualquier módulo existente
cp -r src/pages/clientes src/pages/[tu-entidad]

# Renombra los archivos
ClientesListNew.tsx → [TuEntidad]ListNew.tsx
ClientesDetalles.tsx → [TuEntidad]Detalles.tsx
ClientesForm.tsx → [TuEntidad]Form.tsx
ClientesConfirm.tsx → [TuEntidad]Confirm.tsx
```

#### **2. Adaptación Paso a Paso**

1. **Reemplaza imports**: Cambia `clienteApi` por tu API
2. **Actualiza tipos**: Modifica interfaces según tus datos
3. **Personaliza campos**: Adapta formularios a tus necesidades
4. **Ajusta validaciones**: Configura reglas de React Hook Form
5. **Modifica estilos**: Personaliza colores y layout

#### **3. Componentes Reutilizables**

```typescript
// Importa componentes comunes
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Card } from "../components/common/Card";
import { Table, Column } from "../components/common/Table";
import Modal from "../components/common/Modal";
```

#### **4. Ejemplo de Implementación Rápida**

```typescript
// 1. Crea tu API mock (como los ejemplos)
export async function obtenerMisEntidades() {
  /* ... */
}

// 2. Copia un patrón completo
// 3. Reemplaza llamadas API
// 4. Personaliza campos y validaciones
// 5. ¡Listo para usar!
```

### 📚 **Recursos de Aprendizaje**

- **Clientes**: Ejemplo completo de CRUD con todas las operaciones
- **Notificaciones**: Manejo de estados y actualizaciones en tiempo real
- **Técnicos**: Formularios complejos con validaciones avanzadas
- **Usuarios**: Gestión de permisos y roles
- **Configuración**: Formularios de configuración del sistema

## Próximas Mejoras

- [ ] Implementar TanStack Query para cache
- [ ] Agregar formularios completos de creación/edición
- [ ] Implementar upload de archivos con drag & drop
- [ ] Agregar gráficos con recharts
- [ ] PWA con service worker
- [ ] WebSocket para notificaciones en tiempo real
- [ ] Exportación de reportes a PDF/Excel
- [ ] Tests con Vitest y Testing Library

## Licencia

MIT
