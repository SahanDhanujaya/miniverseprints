import type { Metadata } from "next";
import "./globals.css";
import JsonLd from '@/components/seo/JsonLd';
import { buildOrganizationSchema } from '@/lib/seo';
import Adsense from '@/components/ads/Adsense';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miniverseprints.lk';

export const metadata: Metadata = {
  title: {
    default: "MiniVersePrints - Custom 3D Printed Figures & Collectibles",
    template: "%s | MiniVersePrints",
  },
  description:
    "Premium 3D-printed figures, anime statues, busts, miniatures, and custom collectibles from Sri Lanka.",
  keywords: [
    "3D printed figures",
    "collectibles",
    "Sri Lanka",
    "anime figures",
    "superhero figures",
    "miniatures",
    "busts",
    "custom figures",
    "custom 3D printing Sri Lanka",
  ],
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "MiniVersePrints",
    title: "MiniVersePrints - 3D Printed Figures & Custom Works",
    description:
      "Premium 3D-printed figures, busts, miniatures, and custom collectibles from Sri Lanka.",
    url: SITE_URL,
    images: [`${SITE_URL}/images/og-default.png`],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MiniVersePrints',
    title: 'MiniVersePrints - 3D Printed Figures & Custom Works',
    description:
      'Premium 3D-printed figures, busts, miniatures, and custom collectibles from Sri Lanka.',
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
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Organization structured data */}
        <JsonLd data={buildOrganizationSchema()} />
        {/* Google AdSense */}
        <Adsense />
        {children}
      </body>
    </html>
  );
}
