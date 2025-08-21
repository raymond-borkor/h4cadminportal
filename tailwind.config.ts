import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: { brand: { 50:'#fff1ec',100:'#ffdace',200:'#ffb29b',300:'#ff855f',400:'#ff5f30',500:'#f74f22',600:'#d43f18',700:'#a83215',800:'#7f2814',900:'#6a2213' } },
      boxShadow: { soft: '0 10px 30px rgba(0,0,0,0.08)', focus: '0 0 0 4px rgba(247,79,34,0.2)' }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')]
} satisfies Config
