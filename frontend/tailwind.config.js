/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
     fontFamily: {
      delafield: ['"Mrs Saint Delafield"', 'cursive'],
      lavish: ['"Lavishly Yours"', 'cursive'],
        gabriela: ['Gabriela', 'serif'],
        satisfy: ['Satisfy', 'cursive'],
      },
    keyframes: {
      gradient: {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    },
    animation: {
      gradient: 'gradient 8s ease-in-out infinite',
    },
  },
},
  plugins: [],
};