/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--text)',
        card: 'var(--backgroundLight)',
        border: 'color-mix(in lab, var(--text) 10%, transparent)',
        primary: 'var(--primary)',
        muted: {
          foreground: 'var(--textLight)',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

