/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF3838',
          orange: '#FF7A00',
          yellow: '#FFB800',
          dark: '#0D0D0E',
          card: '#161618',
          border: '#2A2A2D',
          text: '#F3F4F6',
          muted: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
