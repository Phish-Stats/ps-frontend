/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        'bg-light': '#F8FAFC',
        'bg-dark': '#0F172A',
        'card-light': '#FFFFFF',
        'card-dark': '#1E293B',
      },
    },
  },
  plugins: [],
}

