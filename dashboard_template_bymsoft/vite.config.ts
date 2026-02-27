import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-pdf": ["jspdf", "html2canvas"],
          "vendor-ui": ["lucide-react", "sweetalert2"],
          "vendor-tanstack": ["@tanstack/react-query", "@tanstack/react-table"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 1 MB - reducir warnings
  },
});
