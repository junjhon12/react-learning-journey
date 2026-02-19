/** @type {import('tailwindcss').Config} */
export default {
  // We tell Tailwind to look at our HTML file and all TS/TSX files in the src folder
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}