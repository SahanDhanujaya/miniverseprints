import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miniverseprints.lk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${SITE_URL}/custom-order`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/reviews`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/delivery`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
  ];

  return staticPages;
}
