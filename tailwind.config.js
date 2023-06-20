/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        green: '#15803d',
        lightGreen: '#CCFFCC',
        btnhover: '#22c55e',
      },
    },
  },
  plugins: [],
}

