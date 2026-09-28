import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand — restrained blue/indigo, deliberately cooler and more
        // saturated toward indigo than a generic slate admin palette,
        // but still desaturated enough to read as "decision-support",
        // not "marketing SaaS".
        brand: {
          25: "#F8FAFF",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB", // PAIMANA primary
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#0F172A", // PAIMANA navy
          950: "#0B1120",
        },
        canvas: "#F8FAFC",
        // Risk system — locked meanings, used nowhere else
        risk: {
          high: "#DC2626",
          highBg: "#FEF2F2",
          highBorder: "#FCA5A5",
          medium: "#D97706",
          mediumBg: "#FFFBEB",
          mediumBorder: "#FCD34D",
          low: "#16A34A",
          lowBg: "#F0FDF4",
          lowBorder: "#86EFAC",
        },
        ink: {
          25: "#FAFBFC",
          900: "#0F172A",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.625rem",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(15 23 42 / 0.04)",
        card: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
        hover: "0 3px 10px -3px rgb(15 23 42 / 0.10)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
