/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ff5724",
        "background-light": "#f8f6f5",
        "background-dark": "#121212",
        "accent-cyan": "#00f5ff",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "serif": ["Lora", "serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

