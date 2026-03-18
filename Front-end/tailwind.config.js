/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
          colors: {
              'primary': '#0C324A',    /* Azul Profundo */
              'accent': '#C11720',     /* Rojo */
              'secondary': '#679CBC',  /* Azul Claro */
              'cream': '#FEF1D5',      /* Crema */
              'bg-gray': '#f4f6f8',
              'text-dark': '#1e293b',
              'text-light': '#94a3b8',
          },
          fontFamily: {
            roboto: ['Roboto', 'sans-serif'],
          }
      },
    },
    plugins: [],
  }
