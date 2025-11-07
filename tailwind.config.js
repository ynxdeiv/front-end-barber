/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1A1A1A",
        "primary-darker": "#000000",
        "primary-accent": "#B8860B",
        "background-light": "#FAFAFA",
        "background-dark": "#1A1A1A",
        "text-dark": "#1A1A1A",
        "text-light": "#FAFAFA",
        "text-muted-dark": "#4A4A4A",
        "text-muted-light": "#B0B0B0",
        "border-dark": "#4A4A4A",
        "border-light": "#D0D0D0",
        "input-bg-dark": "#2C2C2C",
        "input-bg-light": "#FFFFFF",
        "pearl-white": "#FAFAFA",
        "barber-gold": "#B8860B",
        "barber-brown": "#6B5B4F"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}

