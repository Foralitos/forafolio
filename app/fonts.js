import localFont from "next/font/local";
import { Press_Start_2P } from "next/font/google";

// next/font sustituye a los @font-face + <link rel="preload"> manuales que el
// Remix declaraba en root.tsx: autohospeda, hashea y precarga solo lo que la
// página usa. Cada fuente se expone como CSS variable y tailwind.config.js las
// referencia por nombre (font-neuebit, font-mondwest, font-pixel).
export const neuebit = localFont({
  src: "./fonts/ppneuebit-bold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-neuebit",
});

export const mondwest = localFont({
  src: "./fonts/ppmondwest-regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-mondwest",
});

export const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});
