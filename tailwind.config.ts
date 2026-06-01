import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#16A34A",
        warning: "#F59E0B",
        // Extended custom color weights for premium themes
        slate: {
          ...colors.slate,
          55: "#f1f5f9",
          150: "#e2e8f0",
          250: "#cbd5e1",
          350: "#94a3b8",
          450: "#64748b",
          550: "#475569",
          650: "#334155",
          655: "#1e293b",
          750: "#1e293b",
          850: "#0f172a",
        },
        zinc: {
          ...colors.zinc,
          150: "#f4f4f5",
          250: "#e4e4e7",
          350: "#cbd5e1",
          450: "#a1a1aa",
          550: "#71717a",
          650: "#52525b",
          750: "#3f3f46",
          850: "#27272a",
        },
        indigo: {
          ...colors.indigo,
          150: "#e0e7ff",
          250: "#c7d2fe",
          450: "#818cf8",
          455: "#6366f1",
          650: "#4f46e5",
        },
        emerald: {
          ...colors.emerald,
          450: "#34d399",
        },
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '20%': { transform: 'translateY(0px)', opacity: '1' },
          '80%': { transform: 'translateY(-20px)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 5s ease-in-out infinite',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-space-mono)", "Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
