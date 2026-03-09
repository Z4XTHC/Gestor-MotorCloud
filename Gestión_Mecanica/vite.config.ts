import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
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
