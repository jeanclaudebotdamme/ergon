import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base colors
        background: "#1a1a1a",
        surface: {
          DEFAULT: "#222",
          secondary: "#2a2a2a",
          hover: "#252525",
          elevated: "#303030",
        },
        // Text colors
        text: {
          DEFAULT: "#e8e4df",
          muted: "#a0a0a0",
          subtle: "#888",
          disabled: "#666",
        },
        // Accent - Forest Green
        accent: {
          DEFAULT: "#2d5a3d",
          hover: "#3a7550",
          light: "#a8c5b0",
          muted: "#7cb88a",
        },
        // Semantic colors
        border: {
          DEFAULT: "#2a2a2a",
          hover: "#3a3a3a",
          subtle: "#333",
        },
        tag: {
          jason: {
            bg: "rgba(45, 90, 61, 0.3)",
            text: "#7cb88a",
          },
          jc: {
            bg: "rgba(82, 82, 122, 0.3)",
            text: "#a0a0d0",
          },
          priority: {
            bg: "rgba(180, 100, 60, 0.25)",
            text: "#d4a574",
          },
        },
        status: {
          backlog: "#888",
          progress: "#7cb88a",
          jason: "#d4a574",
          jc: "#a0a0d0",
          done: "#5a8a6a",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["12px", { lineHeight: "1.5" }],
        base: ["14px", { lineHeight: "1.6" }],
        lg: ["15px", { lineHeight: "1.6" }],
        xl: ["20px", { lineHeight: "1.3" }],
        "2xl": ["24px", { lineHeight: "1.2" }],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "10px",
        xl: "12px",
      },
      spacing: {
        sidebar: "240px",
        header: "73px",
        column: "280px",
      },
    },
  },
  plugins: [],
};
export default config;
