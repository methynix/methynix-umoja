/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vicoba: {
          forest: '#1B5E20',
          gold: '#D4A017',
          cream: '#FDFBF5',
          leaf: '#4CAF50',
          earth: '#C62828',
          dark: '#2E302E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}