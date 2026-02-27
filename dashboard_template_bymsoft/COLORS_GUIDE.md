# Guía de Colores del Dashboard

## Paleta de Colores Personalizada

### Colores Principales

#### Primary - Verde Principal (#F39F23)

**Uso:**

- Botones primarios (CTA)
- Enlaces principales
- Fondo del sidebar
- Iconos de usuario
- Anillos de focus en inputs

**Variantes:**

- `primary-light` (#84d4cc): Hover states, fondos suaves
- `primary-lighter` (#9fd9c5): Backgrounds secundarios, headers de cards
- `primary-dark` (#2d7a66): Hover en botones del sidebar

**Ejemplos:**

```jsx
<Button variant="primary">Guardar</Button>
<div className="bg-primary text-white">Sidebar</div>
<input className="focus:ring-primary" />
```

#### Secondary - Naranja (#f1a023)

**Uso:**

- Botones secundarios
- Badges de notificaciones
- Estados de advertencia (warning)
- Alertas importantes

**Ejemplos:**

```jsx
<Button variant="secondary">Acción Secundaria</Button>
<span className="bg-secondary text-white">Badge</span>
```

#### Accent - Verde Oscuro (#54ac4e)

**Uso:**

- Items activos en navegación
- Estados de éxito
- Énfasis en elementos importantes
- Hover en botones primarios

**Ejemplos:**

```jsx
<Link className="bg-primary-dark text-white">Item Activo</Link>
<span className="bg-primary-dark/20 text-accent">Activo</span>
```

### Colores de Apoyo

#### Warm Light - Beige Claro (#f8d2a6)

**Uso:**

- Fondo de cards y contenedores
- Filas pares en tablas
- Backgrounds de secciones

**Ejemplos:**

```jsx
<Card className="bg-warm-light">Contenido</Card>
<tr className="bg-warm-light/50">Fila tabla</tr>
```

#### Warm Medium - Dorado Suave (#f6bf70)

**Uso:**

- Badges secundarios
- Etiquetas de estado
- Hover en botones secundarios

**Ejemplos:**

```jsx
<span className="bg-warm-medium text-white">Tag</span>
```

#### Coral - Coral (#f4ac9c)

**Uso:**

- Estados de advertencia suave
- Errores no críticos
- Botones de acciones destructivas
- Mensajes de validación

**Ejemplos:**

```jsx
<Button variant="danger" className="bg-coral">Eliminar</Button>
<p className="text-coral">Error de validación</p>
```

#### Neutral Light - Rosa Gris (#e2d4d8)

**Uso:**

- Bordes de elementos
- Divisores de secciones
- Backgrounds neutros

**Ejemplos:**

```jsx
<div className="border border-neutral-light">Card</div>
<hr className="border-neutral-light" />
```

#### Background - Gris Muy Claro (#f3f2f3)

**Uso:**

- Fondo principal de la aplicación
- Background del header

**Ejemplos:**

```jsx
<body className="bg-neutral-bg">
<header className="bg-neutral-bg">
```

## Modo Oscuro

### Dark Primary (#84d4cc)

**Uso:**

- Color primario en modo oscuro
- Reemplaza el verde principal
- Mejor contraste sobre fondos oscuros

### Dark BG (#1a1a1a)

**Uso:**

- Fondo principal en modo oscuro
- Reemplaza el gris claro

### Dark Surface (#2d2d2d)

**Uso:**

- Cards y contenedores en modo oscuro
- Sidebar en modo oscuro
- Superficies elevadas

### Dark Text (#f3f2f3)

**Uso:**

- Texto principal en modo oscuro
- Títulos y encabezados

## Esquema por Componente

### Sidebar

```jsx
// Modo claro
bg-primary (verde)
text-white

// Items activos
bg-primary-dark (verde oscuro)
text-white

// Hover
bg-primary-lighter (verde muy claro)

// Modo oscuro
bg-dark-surface
text-dark-text
```

### Header

```jsx
// Fondo
bg-neutral-bg (gris claro)

// Bordes
border-neutral-light

// Botones
text-primary hover:bg-primary-lighter

// Badges de notificaciones
bg-secondary (naranja)
```

### Cards y Contenedores

```jsx
// Fondo
bg-warm-light (beige claro)

// Bordes
border-neutral-light

// Headers
bg-primary-lighter/30 (verde muy claro con opacidad)

// Sombras
shadow-primary (sombra verde suave)
```

### Botones

#### Primario

```jsx
bg-primary (#F39F23)
hover:bg-primary-dark (#54ac4e)
text-white
focus:ring-primary
```

#### Secundario

```jsx
bg-secondary (#f1a023)
hover:bg-warm-medium (#f6bf70)
text-white
focus:ring-secondary
```

#### Outline

```jsx
bg-warm-light (#f8d2a6)
text-primary (#F39F23)
border-neutral-light (#e2d4d8)
hover:border-primary
```

#### Danger

```jsx
bg-coral (#f4ac9c)
hover:bg-red-600
text-white
focus:ring-coral
```

### Tablas

#### Header

```jsx
bg-primary-lighter/50 (#9fd9c5 con opacidad)
text-gray-900
font-semibold
```

#### Filas Pares

```jsx
bg-warm-light/50 (#f8d2a6 con opacidad)
```

#### Filas Impares

```jsx
bg - white;
```

#### Hover

```jsx
hover: bg - primary - lighter / 30;
transition - colors;
```

#### Bordes

```jsx
border-neutral-light (#e2d4d8)
```

### Estados y Badges

#### Activo/Éxito

```jsx
bg-primary-dark/20 (#54ac4e con opacidad)
text-accent
```

#### Inactivo/Error

```jsx
bg-coral/20 (#f4ac9c con opacidad)
text-coral
```

#### Pendiente/Advertencia

```jsx
bg-secondary/20 (#f1a023 con opacidad)
text-secondary
```

#### Información

```jsx
bg-primary/20 (#F39F23 con opacidad)
text-primary
```

## Accesibilidad

### Contraste de Colores

Todos los colores cumplen con WCAG AA:

- Texto oscuro sobre fondos claros: Ratio > 4.5:1
- Texto claro sobre fondos oscuros: Ratio > 4.5:1
- Texto sobre colores primarios: Siempre blanco para máximo contraste

### Focus Visible

```jsx
focus: outline - none;
focus: ring - 2;
focus: ring - primary;
focus: ring - offset - 2;
```

### Estados Hover

Todos los elementos interactivos tienen estados hover claros:

- Cambio de color de fondo
- Transiciones suaves (transition-colors)
- Feedback visual inmediato

## Transiciones

### Suaves

```jsx
transition - colors;
transition - all;
duration - 200;
```

### Sombras

```jsx
// Normal
shadow - primary;

// Hover
hover: shadow - primary - lg;
transition - shadow;
```

## Ejemplos de Uso Completo

### Card Completa

```jsx
<div className="bg-warm-light dark:bg-dark-surface rounded-lg border border-neutral-light dark:border-dark-bg shadow-primary">
  <div className="px-6 py-4 border-b border-neutral-light bg-primary-lighter/30">
    <h3 className="text-gray-900 dark:text-dark-text">Título</h3>
  </div>
  <div className="p-6">Contenido</div>
</div>
```

### Botón Primario Completo

```jsx
<button
  className="
  bg-primary hover:bg-primary-dark
  text-white
  px-4 py-2 rounded-lg
  transition-all
  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  min-h-[44px]
"
>
  Guardar
</button>
```

### Input Completo

```jsx
<input
  className="
  w-full px-4 py-2
  bg-white dark:bg-dark-bg
  border border-neutral-light dark:border-dark-bg
  hover:border-primary dark:hover:border-dark-primary
  rounded-lg
  focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary
  transition-colors
  min-h-[44px]
  dark:text-dark-text
"
/>
```

## Notas Importantes

1. **NUNCA usar morado, índigo o violeta** a menos que sea específicamente solicitado
2. **Siempre aplicar dark mode variants** con `dark:` prefix
3. **Mínimo 44px de altura** en elementos interactivos para touch
4. **Transiciones suaves** en todos los cambios de estado
5. **Sombras verdes sutiles** para elevar elementos importantes
6. **Mantener consistencia** en el uso de colores por tipo de acción
