import type { Metadata } from "next";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miniverseprints.lk';
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from '@/components/seo/JsonLd';
import { buildOrganizationSchema } from '@/lib/seo';
import Adsense from '@/components/ads/Adsense';

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
    url: SITE_URL,
    images: [`${SITE_URL}/images/og-default.png`],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MiniVersePrints',
    title: 'MiniVersePrints - 3D Printed Figures & Collectibles',
    description:
      'Premium 3D-printed figures, busts, miniatures, and collectibles from Sri Lanka.',
    images: [`${SITE_URL}/images/og-default.png`],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-US': '/',
      'en': '/',
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
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
        {/* Organization structured data */}
        <JsonLd data={buildOrganizationSchema()} />
        {/* Google AdSense (renders only if NEXT_PUBLIC_ADSENSE_CLIENT is set) */}
        <Adsense />
        {children}
      </body>
    </html>
  );
}
