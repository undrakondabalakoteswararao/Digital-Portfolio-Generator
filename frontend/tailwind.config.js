const c = (n) => `rgb(var(--${n}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      colors: {
        page: c('page'),
        surface: c('surface'),
        ink: c('ink'),
        muted: c('muted'),
        line: c('line'),
        brand: { DEFAULT: c('brand'), soft: c('brand-soft'), fg: c('brand-fg') },
      },
    },
  },
  plugins: [],
};
