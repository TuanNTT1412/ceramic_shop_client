/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Material 3 Palette for Sahara Ceramic Atelier
        "primary": "#c2652a",
        "on-primary": "#ffffff",
        "primary-container": "#e08850",
        "on-primary-container": "#fbe8d8",
        "primary-fixed": "#fbe8d8",
        "primary-fixed-dim": "#f0a878",
        "on-primary-fixed": "#401a08",
        "on-primary-fixed-variant": "#8a4518",
        "inverse-primary": "#f0a878",

        "surface": "#faf5ee",
        "on-surface": "#3a302a",
        "surface-variant": "#ece6dc",
        "on-surface-variant": "#605850",
        "surface-dim": "#dcd6cc",
        "surface-bright": "#faf5ee",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f0e8",
        "surface-container": "#f2ece4",
        "surface-container-high": "#ece6dc",
        "surface-container-highest": "#e6e0d6",
        "inverse-surface": "#3a302a",
        "inverse-on-surface": "#faf5ee",
        "surface-tint": "#c2652a",

        "background": "#faf5ee",
        "on-background": "#3a302a",

        "secondary": "#78706a",
        "on-secondary": "#ffffff",
        "secondary-container": "#eae2da",
        "on-secondary-container": "#605850",
        "secondary-fixed": "#eae2da",
        "secondary-fixed-dim": "#cec6be",
        "on-secondary-fixed": "#2a2420",
        "on-secondary-fixed-variant": "#504840",

        "tertiary": "#8c3c3c",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#d47070",
        "on-tertiary-container": "#3a2020",
        "tertiary-fixed": "#fce0e0",
        "tertiary-fixed-dim": "#e8a0a0",
        "on-tertiary-fixed": "#2e1515",
        "on-tertiary-fixed-variant": "#6e3030",

        "error": "#c0392b",
        "on-error": "#ffffff",
        "error-container": "#fce4e0",
        "on-error-container": "#7a1a10",

        "outline": "#9a9088",
        "outline-variant": "#d8d0c8",

        // Sahara Tokens
        sahara: {
          primary: '#c2652a',
          'primary-hover': '#a85420',
          'primary-light': '#fbeee4',
          dark: '#8c3b16',
          sand: '#e8ded2',
          page: '#faf7f2',
          surface: '#ffffff',
          'surface-warm': '#fcf9f5',
          border: '#eee6db',
          'border-card': '#e5dacd',
        },
        text: {
          main: '#2b221b',
          body: '#4a3f35',
          muted: '#857567',
        },
      },
      fontFamily: {
        headline: ['"Newsreader"', 'serif'],
        display: ['"Newsreader"', 'serif'],
        serif: ['"Newsreader"', 'serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
        label: ['"Be Vietnam Pro"', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'warm-sm': '0 2px 6px -1px rgba(90, 60, 40, 0.04), 0 1px 3px rgba(90, 60, 40, 0.03)',
        'warm-md': '0 8px 20px -3px rgba(90, 60, 40, 0.06), 0 3px 6px rgba(90, 60, 40, 0.04)',
        'pill': '0 12px 32px -4px rgba(90, 60, 40, 0.12), 0 4px 8px -2px rgba(90, 60, 40, 0.04)',
      },
      aspectRatio: {
        'ceramic': '4 / 5',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleUp: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
