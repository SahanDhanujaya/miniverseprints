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
      'https://web.facebook.com/people/Miniverseprints/61584163672754/?mibextid=wwXIfr&rdid=rgTYmeg5R5GcK7hk&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F18gdYUw7Da%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr',
      'https://www.instagram.com/miniverseprints?dlrf=dmFldHZxYjRqOWNw',
      'https://www.tiktok.com/@miniverseprints?_r=1&_t=ZS-9AUC1rzfbcb',
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
