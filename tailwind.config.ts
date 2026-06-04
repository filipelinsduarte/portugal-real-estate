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
        // JamesEdition palette
        primary:       '#006c75',
        'primary-dark':'#19818a',
        bg:            '#ffffff',
        surface:       '#f5f5f5',
        'surface-warm':'#efede8',
        ink:           '#151515',
        secondary:     '#606060',
        muted:         '#717171',
        subtle:        '#adadad',
        border:        '#e0e0e0',
        'border-muted':'#eaeaea',
        error:         '#ec4850',
      },
      fontFamily: {
        serif: ['Prata', 'Georgia', 'serif'],
        sans:  ['Inter', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': '11px',
        xs:    '12px',
        sm:    '14px',
        base:  '16px',
        lg:    '18px',
        xl:    '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '34px',
        '6xl': '42px',
      },
      letterSpacing: {
        wide: '1px',
      },
      borderRadius: {
        none:  '0px',
        sm:    '3px',
        DEFAULT:'4px',
        md:    '6px',
        pill:  '100px',
        full:  '50%',
      },
      boxShadow: {
        sm:   '0 0 4px rgba(0,0,0,0.2)',
        md:   '0 4px 8px 0 rgba(0,0,0,0.08)',
        lg:   '0 0 9px 3px rgba(0,0,0,0.1)',
        xl:   '0 0 15px 3px rgba(0,0,0,0.1)',
        drop: '0 4px 20px rgba(0,0,0,0.05), 0 1px 5px rgba(0,0,0,0.1)',
      },
      maxWidth: {
        site: '1920px',
      },
    },
  },
  plugins: [],
}

export default config
