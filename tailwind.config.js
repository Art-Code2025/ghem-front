/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#f8f5f0', // اللون الكريمي الفاتح
          100: '#f0ece5',
        },
        gold: {
          500: '#d4af37', // ذهبي فاتح
          600: '#c19a2e', // ذهبي غامق شوية
          700: '#af8725', // ذهبي أغمق
        },
      },
    },
  },
  plugins: [],
}