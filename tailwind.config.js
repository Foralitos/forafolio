/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./libs/**/*.{js,jsx}",
  ],
  // El escritorio pone data-theme="day|night" según la hora de CDMX
  // (components/desktop/Desktop.jsx); `dark:` sigue a ese atributo y no a la
  // preferencia del sistema del visitante.
  darkMode: ["selector", '[data-theme="night"]'],
  theme: {
    extend: {
      fontFamily: {
        // Fuente de sistema: en Mac es San Francisco, que es justo lo que hace
        // que la barra y las ventanas se sientan de macOS. SF no se puede
        // autohospedar, así que se pide al sistema.
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
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
      colors: {
        // Tokens del escritorio; los valores viven en app/globals.css por tema.
        desk: {
          bar: "rgb(var(--desk-bar) / <alpha-value>)",
          win: "rgb(var(--desk-win) / <alpha-value>)",
          chrome: "rgb(var(--desk-chrome) / <alpha-value>)",
          line: "rgb(var(--desk-line) / <alpha-value>)",
          fg: "rgb(var(--desk-fg) / <alpha-value>)",
          muted: "rgb(var(--desk-muted) / <alpha-value>)",
        },
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
