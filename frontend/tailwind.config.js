/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Asegurarse de que las clases personalizadas se generen
    'bg-backrooms-dark',
    'bg-backrooms-dark-light',
    'bg-backrooms-yellow',
    'bg-backrooms-yellow-dark',
    'text-backrooms-yellow',
    'text-backrooms-yellow-dark',
    'text-backrooms-dark',
    'text-backrooms-dark-light',
    'border-backrooms-yellow',
    'from-backrooms-yellow',
    'to-backrooms-yellow-dark',
    'via-backrooms-dark-light',
    // Opacity variants
    {
      pattern: /bg-backrooms-(yellow|dark|dark-light|yellow-dark)\/(5|10|15|20|30|40|50|60|70|80|90|95|98)/,
    },
    {
      pattern: /text-backrooms-(yellow|dark|dark-light|yellow-dark)\/(5|10|15|20|30|40|50|60|70|80|90|95)/,
    },
    {
      pattern: /border-backrooms-(yellow|dark|dark-light)\/(10|20|30|40|50|60)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        backrooms: {
          yellow: '#ffdc64',
          'yellow-dark': '#d4a437',
          dark: '#141414',
          'dark-light': '#1a1a1a',
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 3s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
