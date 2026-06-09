/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFF3EE',
          100: '#FFE4D5',
          200: '#FFC4A8',
          300: '#FF9F78',
          400: '#FF8050',
          500: '#FF6B35',
          600: '#E5501A',
          700: '#C23C0F',
          800: '#9E2E08',
          900: '#7A2105',
        },
        secondary: {
          DEFAULT: '#2EC4B6',
          50: '#EDFAF9',
          100: '#D0F3F0',
          200: '#9FE8E3',
          300: '#63D9D2',
          400: '#3FCDC5',
          500: '#2EC4B6',
          600: '#229E92',
          700: '#177870',
          800: '#0E5450',
          900: '#073330',
        },
        background: {
          DEFAULT: '#000000',
          secondary: '#0D0D0D',
        },
        text: {
          DEFAULT: '#F3F4F6',
          secondary: '#9CA3AF',
        },
        error: '#E63946',
        success: '#2EC4B6',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0.1rem 0.5rem rgba(0,0,0,0.08), 0 0.1rem 0.2rem rgba(0,0,0,0.05)',
        'card-hover': '0 0.4rem 1.5rem rgba(0,0,0,0.12)',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-in-right': 'slideInRight 0.3s ease forwards',
        'spin-slow': 'spin 1.5s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      maxWidth: {
        feed: '800px',
      },
    },
  },
  plugins: [],
}
