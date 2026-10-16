import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF0DE',
          300: '#FFE4C4',
          400: '#F5D5A8',
        },
        navy: {
          900: '#0A0F1E',
          800: '#111833',
          700: '#1A2347',
          600: '#243059',
        },
        gold: {
          DEFAULT: '#C8954C',
          light: '#E0B978',
          dark: '#A07836',
        },
        slate: {
          750: '#293548',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(10, 15, 30, 0.08)',
        'glass-lg': '0 16px 48px rgba(10, 15, 30, 0.12)',
        'gold': '0 4px 20px rgba(200, 149, 76, 0.3)',
        'gold-lg': '0 8px 32px rgba(200, 149, 76, 0.4)',
        'card': '0 2px 12px rgba(10, 15, 30, 0.06)',
        'card-hover': '0 8px 30px rgba(10, 15, 30, 0.12)',
        'nav': '0 -4px 20px rgba(10, 15, 30, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};

export default config;