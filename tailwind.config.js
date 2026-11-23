/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem", xl: "3rem" },
      screens: { sm: "100%", md: "100%", lg: "100%", xl: "1360px", "2xl": "1560px" },
    },
    extend: {
      colors: {
        // CARE Academy brand palette — turmeric yellow (holud) + navy slate.
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcddff',
          300: '#8ec7ff',
          400: '#59a6ff',
          500: '#2f83f7',
          600: '#1b63ec',
          700: '#174ed4',
          800: '#1941ac',
          900: '#1a3b88',
        },
        // Turmeric yellow (holud) accent
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F4B400',
          600: '#D49A00',
          700: '#A16207',
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
