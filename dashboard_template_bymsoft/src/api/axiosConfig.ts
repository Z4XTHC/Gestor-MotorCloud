import axios from "axios";

// Configuración base para desarrollo sin backend
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // URL base (no se usará en modo mock)
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para simular respuestas (modo mock)
axiosInstance.interceptors.request.use(
  (config) => {
    // En modo mock, no hacer la petición real
    // Simular delay de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(config);
      }, 500); // 500ms delay simulado
    });
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de respuesta para simular datos
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si es una petición cancelada, rechazar normalmente
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Para desarrollo, simular respuestas exitosas en lugar de errores
    console.warn("API call intercepted (mock mode):", error.config?.url);

    // Retornar una respuesta mock en lugar del error
    return Promise.resolve({
      data: {
        success: true,
        message: "Mock response - API not available",
        data: [],
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: error.config,
    });
  },
);

export default axiosInstance;
