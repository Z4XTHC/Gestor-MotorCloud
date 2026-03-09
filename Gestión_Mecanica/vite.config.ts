import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    // En desarrollo: reenvía /api/** al backend Spring Boot
    // Así VITE_API_BASE_URL puede quedar vacío en ambos entornos
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // El build va directo a la carpeta static de Spring Boot
    outDir: path.resolve(
      __dirname,
      "../motorCloud - Backend/src/main/resources/static",
    ),
    emptyOutDir: true,
  },
});
