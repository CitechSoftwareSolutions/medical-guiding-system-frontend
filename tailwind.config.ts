import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Clinical Blues (deep sapphire range)
        med: {
          50: "#f0f6ff",
          100: "#e0edfe",
          200: "#bad7fe",
          300: "#7fb5fd",
          400: "#3d8ef8",
          500: "#1a6ef0",
          600: "#0062cc",
          700: "#004b99",
          800: "#023e7d",
          900: "#072a52",
          950: "#031830",
        },
        // Semantic Clinical Accents
        clinical: {
          teal: "#0d9488",
          "teal-light": "#f0fdfa",
          "teal-border": "#ccfbf1",
          "teal-500": "#14b8a6",
          "teal-400": "#2dd4bf",
          emerald: "#059669",
          "emerald-light": "#f0fdf4",
          "emerald-200": "#a7f3d0",
          "emerald-500": "#10b981",
          amber: "#d97706",
          "amber-light": "#fffbeb",
          "amber-200": "#fde68a",
          "amber-400": "#fbbf24",
          "amber-500": "#f59e0b",
          red: "#dc2626",
          "red-light": "#fef2f2",
          "red-200": "#fecaca",
          purple: "#7c3aed",
          "purple-light": "#faf5ff",
          "purple-200": "#ddd6fe",
          "purple-500": "#8b5cf6",
          rose: "#e11d48",
          "rose-light": "#fff1f2",
          "rose-500": "#f43f5e",
        },
        // Neutral Foundation
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Legacy color namespaces (kept for backward compatibility)
        navy: {
          50: "#f0f4ff",
          100: "#e0e8ff",
          200: "#c7d5ff",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        skyline: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      borderRadius: {
        md: "6px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(15, 23, 42, 0.03)",
        xs: "0 1px 3px 0 rgba(15, 23, 42, 0.05)",
        "clinical-md":
          "0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)",
        "clinical-lg":
          "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
        // Vibrant colored shadows for gradient cards
        "glow-blue":
          "0 8px 32px -4px rgba(0, 98, 204, 0.35), 0 2px 8px -2px rgba(0, 98, 204, 0.15)",
        "glow-teal":
          "0 8px 32px -4px rgba(13, 148, 136, 0.35), 0 2px 8px -2px rgba(13, 148, 136, 0.15)",
        "glow-emerald":
          "0 8px 32px -4px rgba(5, 150, 105, 0.35), 0 2px 8px -2px rgba(5, 150, 105, 0.15)",
        "glow-amber":
          "0 8px 32px -4px rgba(217, 119, 6, 0.35), 0 2px 8px -2px rgba(217, 119, 6, 0.15)",
        "glow-purple":
          "0 8px 32px -4px rgba(124, 58, 237, 0.35), 0 2px 8px -2px rgba(124, 58, 237, 0.15)",
        card: "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.05)",
        "card-hover":
          "0 4px 12px rgba(15,23,42,0.10), 0 12px 36px rgba(15,23,42,0.08)",
      },
      fontFamily: {
        display: [
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        sans: [
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: ["Newsreader", "Charter", "ui-serif", "Georgia", "serif"],
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "fade-up": "fade-up 0.5s ease forwards",
        "fade-up-delay-1": "fade-up 0.5s 0.1s ease forwards",
        "fade-up-delay-2": "fade-up 0.5s 0.2s ease forwards",
        "fade-up-delay-3": "fade-up 0.5s 0.3s ease forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        "slide-right": "slide-right 0.4s ease forwards",
        shimmer: "shimmer 1.5s infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
