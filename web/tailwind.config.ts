import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
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
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
        },
        bone: {
          DEFAULT: "rgb(var(--bone) / <alpha-value>)",
          dim: "rgb(var(--bone-dim) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
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
