/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'tall': { 'raw': '(min-height: 600px)' },
      }
    },
  },
  plugins: [],
};
