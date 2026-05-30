import type { Metadata } from "next";
import "./globals.css";
import { allFonts } from "./fonts";

export const metadata: Metadata = {
  title: "in between space",
  description: "An infinite deterministic web labyrinth assembled from familiar website memories.",
  icons: {
    icon: "/favicon.svg?seed=in-between-space%2Fhome&label=in%20between%20space"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fontClasses = allFonts.map((font) => font.variable).join(" ");

  return (
    <html lang="en" className={fontClasses}>
      <body>{children}</body>
    </html>
  );
}
