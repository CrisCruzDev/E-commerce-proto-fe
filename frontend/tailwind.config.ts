import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  // darkMode: "class",
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs: { max: '385px' },
      ...defaultTheme.screens,
    },
    fontFamily: {
      cormorant: ['Cormorant', 'serif'],
      inria: ['Inria', 'serif'],
      work: ['Work', 'sans'],
      // 'body': 'BlinkMacSystemFont',
      // 'sans': 'Helvetica, Arial, sans-serif',
      // 'mono': 'Times New Roman'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'dark-bg': '#0d1117',
        'dark-container': '#171b22',
        'dark-text': '#8D96A0',
        'main-green': '#8AEB94',
        'darker-main-green': '#66b86e',
        'main-red': '#FF4B92',
        'white-text': '#F0F0F0',
        'dark-line': '#3E3F4E',
        'main-purple': '#635FC7',
        'btn-line': '#828FA3',
        'blue-link': '#34C2EF',
        'pumpfun-green': '#86efac',
      },
    },
  },
  plugins: [],
}
export default config
