import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#061326',
          light: '#0a1d3a',
        },
        blue: {
          accent: '#1264e8',
          light: '#4a94ff',
          dark: '#075bc8',
        },
        bg: '#f4f7fb',
        txt: '#101827',
        muted: '#566174',
        border: '#e9edf3',
      },
      fontFamily: {
        sans: ['Arial', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '23px',
      },
      boxShadow: {
        'card': '0 4px 14px #12213b0a',
        'card-hover': '0 8px 25px #12213b15',
        'shop-btn': '0 7px 18px #1264e855',
      },
    },
  },
  plugins: [],
};

export default config;