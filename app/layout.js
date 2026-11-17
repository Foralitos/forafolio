import { Agentation } from "agentation";
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
      <body>
        {children}
        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
      </body>
    </html>
  );
}
