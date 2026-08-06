import type { Config } from "tailwindcss";

// Paleta inspirada em cabines de DJ / mesas analógicas: fundo grafite quente,
// acento âmbar (sinal de VU meter / jog wheel), leitura técnica em mono para BPM/tonalidade.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0F0E13",
          soft: "#16151C",
          surface: "#1E1D26",
          border: "#2C2A36",
        },
        paper: {
          DEFAULT: "#FAF8F4",
          soft: "#F1EEE7",
          surface: "#FFFFFF",
          border: "#E4DFD4",
        },
        signal: {
          DEFAULT: "#E8A33D", // âmbar — acento principal
          dim: "#B87F2E",
          bright: "#FFC466",
        },
        pulse: {
          DEFAULT: "#3DBFA8", // teal — acento secundário / estados positivos
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
