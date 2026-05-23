import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-emerald-500/40",
    "border-l-emerald-300",
    "bg-emerald-300",
    "ring-emerald-400/60",
    "bg-amber-500/50",
    "border-l-amber-300",
    "bg-amber-300",
    "ring-amber-400/60",
    "bg-violet-500/40",
    "border-l-violet-300",
    "bg-violet-300",
    "ring-violet-400/60",
    "bg-rose-500/40",
    "border-l-rose-300",
    "bg-rose-300",
    "ring-rose-400/60",
    "bg-zinc-500/30",
    "border-l-zinc-400",
    "bg-zinc-400",
    "ring-zinc-400/60",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b0b0d",
          soft: "#16161a",
          muted: "#2a2a30",
        },
        bone: {
          DEFAULT: "#f5efe6",
          dim: "#cfc6b8",
        },
        accent: {
          DEFAULT: "#c9a36a",
          hover: "#b88c4f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
