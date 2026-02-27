/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Colores principales utilizados
        primary: {
          // Color base
          DEFAULT: "#940000", // Rojo
          // Derivados (ajustados para variantes UI)
          lighter: "#FFCCCC", // muy claro para fondos sutiles
          light: "#FF6666", // variante clara para botones/hover suaves
          dark: "#800000", // variante oscura para estados activos
          darker: "#660000", // variante más oscura para texto sobre fondos claros
        },
        secondary: {
          // Gris profesional solicitado
          DEFAULT: "#494949",
        },
        // Colores necesarios para el funcionamiento del UI
        neutral: {
          light: "#E5E7EB", // Gris frío para bordes
        },
        // Colores semánticos utilizados en el proyecto
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB", // Agregado para skeleton
          300: "#D1D5DB", // Agregado para texto en modo oscuro
          400: "#9CA3AF",
          500: "#6B7280", // Agregado para varios textos
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937", // Agregado para fondos oscuros
          900: "#111827",
        },
        blue: {
          100: "#DBEAFE",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          900: "#1E3A8A",
        },
        green: {
          100: "#DCFCE7",
          400: "#4ADE80",
          600: "#16A34A",
          700: "#15803D",
          900: "#14532D",
        },
        red: {
          100: "#FEE2E2",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          900: "#7F1D1D",
        },
        yellow: {
          100: "#FEF3C7",
          400: "#FACC15",
          600: "#CA8A04",
          700: "#A16207",
          900: "#713F12",
        },
        purple: {
          100: "#F3E8FF",
          400: "#C084FC",
          700: "#7C3AED",
          900: "#581C87", // Agregado para opacidad en modo oscuro
        },
        white: "#FFFFFF",
        black: "#000000",
        // Modo oscuro
        dark: {
          bg: "#111827", // Fondo oscuro profesional
          surface: "#1F2937", // Superficie de tarjetas oscuras
          text: "#F3F4F6", // Texto claro en modo oscuro
        },
      }, // Sombra de caja con el color de marca
      boxShadow: {
        primary: "0 4px 14px 0 rgba(68, 180, 147, 0.15)",
        "primary-lg": "0 10px 40px 0 rgba(68, 180, 147, 0.25)",
      }, // Animaciones para PWA install prompt
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-down": "slide-down 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
