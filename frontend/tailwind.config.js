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
          50: '#f0f4fe',
          100: '#dee7fc',
          200: '#c4d5fa',
          300: '#9bbbf6',
          400: '#6c96f0',
          500: '#4370e7',
          600: '#2b51db',
          700: '#233ec7',
          800: '#2134a1',
          900: '#1e2f80',
          950: '#141c4e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
