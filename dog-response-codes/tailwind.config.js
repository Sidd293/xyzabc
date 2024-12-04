/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'http-blue': '#4299e1',
        'http-green': '#48bb78',
        'http-red': '#f56565'
      }
    },
  },
  plugins: [],
}