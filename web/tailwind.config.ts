import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
