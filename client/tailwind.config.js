/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#60a5fa", // light blue
          DEFAULT: "#3b82f6", // blue (primary)
          dark: "#2563eb", // dark blue
        },
        secondary: {
          light: "#93c5fd",
          DEFAULT: "#60a5fa",
          dark: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};