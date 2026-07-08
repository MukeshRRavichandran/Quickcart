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
          DEFAULT: '#36641b', 
          light: '#EAF0EC',
          dark: '#163223',
          darker: '#0F2418'
        },
        accent: {
          DEFAULT: '#EF4444', // Red alerts / notifications
          light: '#FEE2E2',
          dark: '#DC2626'
        },
        secondary: {
          DEFAULT: '#DE9E48', 
          light: '#FDF2E2',
          dark: '#C58532'
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
