/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark blue/black theme (Talentify-inspired)
        'space-dark': '#030308',
        'space-deeper': '#06060f',
        'space-blue': '#0a1628',
        'accent-blue': '#3b82f6',
        'accent-cyan': '#06b6d4',
        'accent-emerald': '#10b981',
        'star-white': '#f1f5f9',
        'muted': '#94a3b8',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #030308 0%, #06060f 50%, #0a1628 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
