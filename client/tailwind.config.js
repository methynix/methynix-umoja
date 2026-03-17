/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The core Methynix Palette
        "neon-green": "#39FF14",
        "neon-blue": "#00F3FF",
        "dark-bg": "#0a0a0a",
        "glass-white": "rgba(255, 255, 255, 0.03)",
      },
      backgroundImage: {
        // Custom gradients for that "Nature Glow"
        'glow-mesh': "radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.1) 0%, rgba(0, 0, 0, 1) 100%)",
      },
      boxShadow: {
        // Glowing shadows for buttons and cards
        'glow-green': '0 0 15px rgba(57, 255, 20, 0.3)',
        'glow-blue': '0 0 15px rgba(0, 243, 255, 0.3)',
        'inner-glow': 'inset 0 0 10px rgba(57, 255, 20, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    // Helper to handle the "animate-in" classes I used in the pages
    require("tailwindcss-animate"),
  ],
}