import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'teams-purple': '#6264A7',
        'teams-blue': '#4A5FDC',
        'teams-green': '#92C353',
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'wave': {
          '0%, 100%': {
            transform: 'scaleY(0.5)',
          },
          '50%': {
            transform: 'scaleY(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
