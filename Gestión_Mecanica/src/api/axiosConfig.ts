import axios from "axios";

// Si VITE_API_BASE_URL está vacío (""), axios usará rutas relativas → mismo origen
// que es lo correcto cuando el frontend está servido desde Spring Boot.
// Usar ?? en lugar de || para que "" (vacío) no caiga al fallback.
const baseURL: string =
  (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:8081";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // enviar cookies de sesión al backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
