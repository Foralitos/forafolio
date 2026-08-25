import { getSEOTags } from "@/libs/seo";
import { neuebit, mondwest, pixel } from "./fonts";
import "./globals.css";

export const metadata = getSEOTags();

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${neuebit.variable} ${mondwest.variable} ${pixel.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
