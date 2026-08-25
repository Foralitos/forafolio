/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./libs/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        // Las tres fuentes de identidad se cargan con next/font (app/fonts.js),
        // que expone cada una como CSS variable en el <body>. El @font-face
        // manual del Remix desapareció: next/font hashea, autohospeda y
        // precarga los .otf sin que haya que declarar nada aquí.
        neuebit: ["var(--font-neuebit)", "monospace"],
        mondwest: ["var(--font-mondwest)", "serif"],
        pixel: ["var(--font-pixel)", "monospace"],
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-in": "slide-in 0.5s ease-in-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
