/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./dist/**/*.{html,js}",
  ],
  darkMode: 'media', // Uses prefers-color-scheme
  theme: {
    extend: {
      fontFamily: {
        'signika': ['Signika', 'sans-serif'],
        'nothingyoucoulddo': ['Nothing You Could Do', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
