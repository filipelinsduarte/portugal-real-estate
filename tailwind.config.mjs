/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        accent:    '#c2622a',
        'accent-h':'#a8521f',
        primary:   '#1a1a1a', // alias of ink — used by the about/guide/contact pages
        ink:       '#1a1a1a',
        secondary: '#5c5c5c',
        muted:     '#8a8a8a',
        border:    '#ddd8d0',
        surface:   '#fefcfa',
        cream:     '#fdfaf6',
      },
      fontFamily: {
        serif: ['Prata', 'Georgia', 'serif'],
        sans:  ['Inter', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        pill: '100px',
      },
    },
  },
  plugins: [],
}
