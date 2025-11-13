/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#b8d7ff',
          300: '#8dbdff',
          400: '#5b9aff',
          500: '#2f74ff',
          600: '#1b57e6',
          700: '#1645b4',
          800: '#143a8f',
          900: '#122f73',
        },
        accent: {
          500: '#ff7a59',
          600: '#ff5c33',
        },
      },
      boxShadow: {
        glow: '0 10px 30px rgba(47, 116, 255, 0.35)',
        card: '0 10px 30px rgba(2, 6, 23, 0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at top, rgba(47,116,255,0.15), transparent 60%)',
        'gradient-glow': 'linear-gradient(135deg, rgba(47,116,255,0.25), rgba(255,122,89,0.25))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(47,116,255,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(47,116,255,0.0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
