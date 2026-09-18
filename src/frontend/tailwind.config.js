/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f4',
          100: '#dbece3',
          200: '#b8dbc9',
          300: '#89c3a6',
          400: '#5aa882',
          500: '#388d64',
          600: '#2b7250',
          700: '#245b41',
          800: '#1f4835',
          900: '#1b3c2d',
          950: '#0c2118'
        },
        terracotta: {
          50: '#fbf4f2',
          100: '#f7e7e3',
          200: '#f0d2c9',
          300: '#e4b3a4',
          400: '#d48d78',
          500: '#c86d51',
          600: '#b55539',
          700: '#97432b',
          800: '#7d3826',
          900: '#673123',
          950: '#38160e'
        },
        sand: {
          50: '#faf8f5',
          100: '#f4f0e9',
          200: '#eae2d5',
          300: '#dccebb',
          400: '#c9b49b',
          500: '#b99d80',
          600: '#a98a6f',
          700: '#8d715a',
          800: '#735d4c',
          900: '#5f4d3f'
        },
        charcoal: {
          50: '#f6f7f7',
          100: '#e2e5e6',
          200: '#c5cbce',
          300: '#9da7ac',
          400: '#738087',
          500: '#57656c',
          600: '#465258',
          700: '#3c4449',
          800: '#2a3034',
          900: '#1a1f22',
          950: '#0e1113'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
