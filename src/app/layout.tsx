import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MiniVersePrints - 3D Printed Figures & Collectibles",
    template: "%s | MiniVersePrints",
  },
  description:
    "Premium 3D-printed figures, busts, miniatures, and collectibles from Sri Lanka. Anime, superhero, gaming, and custom figures available.",
  keywords: [
    "3D printed figures",
    "collectibles",
    "Sri Lanka",
    "anime figures",
    "superhero figures",
    "miniatures",
    "busts",
    "custom figures",
  ],
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "MiniVersePrints",
    title: "MiniVersePrints - 3D Printed Figures & Collectibles",
    description:
      "Premium 3D-printed figures, busts, miniatures, and collectibles from Sri Lanka.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
