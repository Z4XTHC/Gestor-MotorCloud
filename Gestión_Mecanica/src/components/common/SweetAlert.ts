import Swal from "sweetalert2";

// Mapeo de colores basado en tailwind.config.js
const colorMap = {
  primary: "#940000", // Rojo principal
  blue: "#3B82F6",
  green: "#16A34A",
  red: "#EF4444",
  yellow: "#FACC15",
  purple: "#7C3AED",
  secondary: "#494949", // Gris profesional
} as const;

type ColorKey = keyof typeof colorMap;

export const showSuccess = (
  title: string,
  text?: string,
  timer?: number,
  color: ColorKey = "green",
) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: colorMap[color],
    timer,
  });
};

export const showError = (
  title: string,
  text?: string,
  color: ColorKey = "red",
) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: colorMap[color],
  });
};

export const showWarning = (
  title: string,
  text?: string,
  color: ColorKey = "yellow",
) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: colorMap[color],
  });
};

export const showInfo = (
  title: string,
  text?: string,
  color: ColorKey = "blue",
) => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonColor: colorMap[color],
  });
};

export const showConfirm = (
  title: string,
  text?: string,
  confirmButtonText?: string,
  cancelButtonText?: string,
  color: ColorKey = "primary",
) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: colorMap[color],
    cancelButtonColor: "#95a5a6",
    confirmButtonText: confirmButtonText || "Sí",
    cancelButtonText: cancelButtonText || "Cancelar",
  });
};

export const showCustom = (options: any) => {
  return Swal.fire(options);
};
