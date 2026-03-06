import axios from "axios";

// BaseURL toma la variable de entorno VITE_API_BASE_URL si está disponible,
// sino usa http://localhost:8080 (donde corre el backend Spring Boot por defecto).
const baseURL =
  (import.meta.env as any).VITE_API_BASE_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // enviar cookies de sesión al backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
