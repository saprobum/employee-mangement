/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // indigo-500
        secondary: '#818cf8', // indigo-400
      },
    },
  },
  plugins: [ ],
}