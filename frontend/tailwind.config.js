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
          light: '#e6f7f0',
          DEFAULT: '#00b074',
          dark: '#038757',
          darker: '#015f3c',
        },
        secondary: {
          light: '#fdf6e2',
          DEFAULT: '#f39c12',
          dark: '#d68910',
        },
        accent: {
          light: '#ffebeb',
          DEFAULT: '#eb5757',
          dark: '#c0392b',
        },
        neutral: {
          50: '#f8fafc',
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
