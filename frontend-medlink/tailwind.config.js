/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1728',
          800: '#0D2040',
          700: '#142E54',
          600: '#1B3C6B',
        },
        brand: {
          blue: '#1E60D5',
          lightBlue: '#EBF3FE',
          sky: '#DCEBFF',
          coral: '#EF4444',
          coralDark: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}

