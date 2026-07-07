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
          light: '#EAF0EC',
          DEFAULT: '#204230',
          dark: '#163223',
          darker: '#0F2418',
        },
        secondary: {
          light: '#FDF2E2',
          DEFAULT: '#DE9E48',
          dark: '#C58532',
        },
        accent: {
          light: '#ffebeb',
          DEFAULT: '#eb5757',
          dark: '#c0392b',
        },
        neutral: {
          50: '#F8F6F0',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
