/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0D0D0D',
          50: '#F5F5F0',
          100: '#E8E8E0',
          200: '#C8C8B8',
          300: '#A0A090',
          400: '#707068',
          500: '#4A4A42',
          600: '#2E2E28',
          700: '#1A1A16',
          800: '#111110',
          900: '#0D0D0D',
        },
        accent: {
          DEFAULT: '#E8622A',
          light: '#F0845A',
          dark: '#C44A18',
        },
        sage: {
          DEFAULT: '#4A7C59',
          light: '#6A9E78',
          dark: '#2E5C3A',
        },
        amber: {
          DEFAULT: '#D4A853',
          light: '#E8C278',
          dark: '#A87828',
        },
      },
    },
  },
  plugins: [],
};
