/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem", xl: "3rem" },
      screens: { sm: "100%", md: "100%", lg: "100%", xl: "1360px", "2xl": "1560px" },
    },
    extend: {
      colors: {
        // CARE Consultancy: navy / royal blue, sky blue and gold on white.
        brand: {
          50: '#f0f7ff', 100: '#e0f0ff', 200: '#bde0fb', 300: '#87CEEB', 400: '#4fa3e0',
          500: '#2a6fd0', 600: '#1d4fa8', 700: '#163f86', 800: '#12306a', 900: '#0c2150',
        },
        // Gold accent
        accent: {
          50: '#FFF9E5', 100: '#FEEFB8', 200: '#FCE08A', 300: '#F8D062',
          400: '#F2BE3A', 500: '#E5A912', 600: '#C28C0A', 700: '#8F6606',
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
