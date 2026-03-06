import type { ColorOption } from "./ColorSelect";

/** Colores más comunes en vehículos. "Otro" siempre al final. */
export const COLORES_VEHICULO: ColorOption[] = [
  { value: "Blanco",          label: "Blanco",          hex: "#FFFFFF" },
  { value: "Blanco Perla",    label: "Blanco Perla",    hex: "#EEECD7" },
  { value: "Negro",           label: "Negro",           hex: "#111111" },
  { value: "Plateado",        label: "Plateado",        hex: "#C0C0C0" },
  { value: "Gris",            label: "Gris",            hex: "#808080" },
  { value: "Gris Oscuro",     label: "Gris Oscuro",     hex: "#404040" },
  { value: "Rojo",            label: "Rojo",            hex: "#CC0000" },
  { value: "Rojo Oscuro",     label: "Rojo Oscuro",     hex: "#8B0000" },
  { value: "Bordó",           label: "Bordó / Vino",    hex: "#800020" },
  { value: "Azul",            label: "Azul",            hex: "#1A4FA0" },
  { value: "Azul Marino",     label: "Azul Marino",     hex: "#001F5B" },
  { value: "Azul Celeste",    label: "Azul Celeste",    hex: "#5B9ED9" },
  { value: "Verde",           label: "Verde",           hex: "#2D8A2D" },
  { value: "Verde Oscuro",    label: "Verde Oscuro",    hex: "#1B4D1B" },
  { value: "Verde Militar",   label: "Verde Militar",   hex: "#4B5320" },
  { value: "Amarillo",        label: "Amarillo",        hex: "#FFD700" },
  { value: "Naranja",         label: "Naranja",         hex: "#FF6600" },
  { value: "Beige",           label: "Beige",           hex: "#F5F0DC" },
  { value: "Café",            label: "Café / Marrón",   hex: "#7B4012" },
  { value: "Dorado",          label: "Dorado",          hex: "#D4AF37" },
  { value: "Turquesa",        label: "Turquesa",        hex: "#30B0A0" },
  { value: "Rosa",            label: "Rosa",            hex: "#F59AB0" },
  { value: "Violeta",         label: "Violeta",         hex: "#7B2FBE" },
  { value: "Otro",            label: "Otro",            hex: undefined },
];
