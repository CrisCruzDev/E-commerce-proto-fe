import type { Config } from 'tailwindcss';

import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  // darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: { max: '385px' },
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        gothic: ['Gothic A1', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#2E2E2E',
        secondary: '#E54134',
        teal: '#74D7C6',
        link: '#498FFF',
        yellow: '#FFD540',
      },
    },
  },
  plugins: [],
};
export default config;
