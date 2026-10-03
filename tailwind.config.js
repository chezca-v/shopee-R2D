/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        shopee: {
          orange: '#EE4D2D',
          'orange-dark': '#D73220',
          'orange-light': '#FF6633',
          'gradient-start': '#F53D2D',
          'gradient-end': '#FF6633',
          red: '#D0011B',
          blue: '#0046AB',
          'light-blue': '#2673DD',
          cyan: '#26AA99',
          yellow: '#EDA500',
          gold: '#D2AA6E',
          gray: '#F5F5F5',
          'text-primary': '#222222',
          'text-secondary': '#999999',
          'text-tertiary': '#CCCCCC',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
