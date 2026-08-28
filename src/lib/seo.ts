import type { Product, Review } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miniverseprints.lk';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MiniVersePrints',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      'https://www.facebook.com/miniverseprints',
      'https://www.instagram.com/miniverseprints',
    ],
  };
}

export function buildProductSchema(product: Product, reviews: Review[] = []) {
  const image = (product.images && product.images.length ? product.images[0].url : (product.product_images && product.product_images[0]?.url)) || `${SITE_URL}/images/og-default.png`;
  const price = product.sale_price ?? product.regular_price;
  const offers = {
    '@type': 'Offer',
    price: price != null ? String(price) : undefined,
    priceCurrency: (product as any).currency || 'LKR',
    availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: `${SITE_URL}/product/${product.slug}`,
  };

  const aggregateRating = reviews && reviews.length ? {
    '@type': 'AggregateRating',
    ratingValue: String((reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)),
    reviewCount: String(reviews.length),
  } : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [image],
    description: product.short_description || product.seo_description || product.full_description || '',
    sku: product.sku || product.id || undefined,
    brand: (product as any).brand || 'MiniVersePrints',
    offers,
    aggregateRating,
  };
}
