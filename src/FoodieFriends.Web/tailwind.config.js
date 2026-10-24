/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD1BD',
          300: '#FFB294',
          400: '#FF8D63',
          500: '#FF6B35', // Primary brand color
          600: '#E8521A',
          700: '#C23E0E',
          800: '#9B320F',
          900: '#7E2C11',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FFFAF5',
          200: '#FFF8F0', // Brand secondary
          300: '#FDEFD9',
          400: '#FBE4BE',
        },
        teal: {
          50: '#F0F9FA',
          100: '#D5F0F2',
          500: '#2EC4B6',
          700: '#1A535C', // Brand accent deep teal
          800: '#143F46',
          900: '#0F2F34',
        },
        charcoal: {
          800: '#3D4447',
          900: '#2D3436', // Brand text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 52, 54, 0.08)',
        'hover': '0 10px 25px -4px rgba(255, 107, 53, 0.15)',
      }
    },
  },
  plugins: [],
}
