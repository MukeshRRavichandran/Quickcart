/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Fresh green
          light: '#E6F7F0',
          dark: '#059669',
          darker: '#047857'
        },
        accent: {
          DEFAULT: '#EF4444', // Red alerts / notifications
          light: '#FEE2E2',
          dark: '#DC2626'
        },
        secondary: {
          DEFAULT: '#F59E0B', // Amber stars
          light: '#FEF3C7',
          dark: '#D97706'
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        sans: ['Poppins', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
