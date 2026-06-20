import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, ShoppingCart, Star, Truck, Shield, Clock } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';
import { getProductEnquiryLink, formatPrice } from '@/lib/utils';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { demoProducts } from '@/lib/demo-store';

async function getProduct(slug: string) {
  if (!hasSupabaseConfig()) {
    const product = demoProducts.find((item) => item.slug === slug);
    if (!product) return null;

    return {
      product,
      reviews: [],
      relatedProducts: demoProducts.filter((item) => item.slug !== slug).slice(0, 4),
      avgRating: 0,
    };
  }

  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(*), product_variations(*), product_categories(categories(*))')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) return null;

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .limit(4);

  return {
    product: product as Product,
    reviews: reviews || [],
    relatedProducts: (relatedProducts || []) as Product[],
    avgRating: reviews?.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: 'Product Not Found' };

  return {
    title: data.product.seo_title || data.product.name,
    description: data.product.seo_description || data.product.short_description || `Buy ${data.product.name} at MiniVersePrints`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();

  const { product, reviews, relatedProducts, avgRating } = data;
  const productImages = product.images?.length ? product.images : product.product_images || [];
  const mainImage = productImages.find((img) => img.is_main) || productImages[0];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumb items={[
        { label: 'Shop', href: '/shop' },
        { label: product.name },
      ]} />

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-background-card border border-border">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt_text || product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground-muted">No Image</div>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.is_new_arrival && <Badge variant="info">New</Badge>}
              {product.sale_price && product.sale_price < product.regular_price && <Badge variant="error">Sale</Badge>}
              {product.product_type === 'made_to_order' && <Badge variant="warning">Made to Order</Badge>}
            </div>
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img) => (
                <div key={img.id} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-background-card border border-border cursor-pointer hover:border-accent transition-colors">
                  <Image src={img.url} alt={img.alt_text || ''} fill className="object-contain" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={Math.round(avgRating)} size="sm" />
            <span className="text-sm text-foreground-muted">({reviews.length} reviews)</span>
          </div>

          <PriceDisplay regularPrice={product.regular_price} salePrice={product.sale_price} size="lg" />

          {product.short_description && (
            <p className="mt-4 text-foreground-muted">{product.short_description}</p>
          )}

          {/* Stock Status */}
          <div className="mt-4 flex items-center gap-2">
            {product.product_type === 'ready_stock' ? (
              product.stock_quantity > 0 ? (
                <Badge variant="success">In Stock ({product.stock_quantity} available)</Badge>
              ) : (
                <Badge variant="error">Out of Stock</Badge>
              )
            ) : (
              <>
                <Badge variant="warning">Made to Order</Badge>
                {product.production_lead_time_days && (
                  <span className="text-sm text-foreground-muted">
                    ~{product.production_lead_time_days} days production
                  </span>
                )}
              </>
            )}
          </div>

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold">Options</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variations.filter(v => v.is_active).map((variation) => (
                  <div
                    key={variation.id}
                    className="p-3 rounded-xl border border-border hover:border-accent cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-medium">
                      {variation.size && <span>{variation.size}</span>}
                      {variation.paint_type && <span> - {variation.paint_type}</span>}
                    </div>
                    <div className="text-sm text-foreground-muted mt-1">
                      {formatPrice(product.regular_price + variation.price_adjustment)}
                    </div>
                    {variation.stock_quantity > 0 && (
                      <div className="text-xs text-success mt-1">{variation.stock_quantity} in stock</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button size="lg" className="w-full" disabled={product.product_type === 'ready_stock' && product.stock_quantity <= 0}>
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </Button>
            <div className="flex gap-3">
              <a
                href={getProductEnquiryLink(product.name, `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="lg" className="w-full">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </Button>
              </a>
              <Button variant="ghost" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-background-card border border-border">
              <Truck className="w-5 h-5 text-accent mb-1" />
              <span className="text-xs text-foreground-muted">Island-wide Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-background-card border border-border">
              <Shield className="w-5 h-5 text-accent mb-1" />
              <span className="text-xs text-foreground-muted">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-background-card border border-border">
              <Clock className="w-5 h-5 text-accent mb-1" />
              <span className="text-xs text-foreground-muted">Quality Checked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.full_description && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="prose prose-invert max-w-none text-foreground-muted" dangerouslySetInnerHTML={{ __html: product.full_description }} />
        </section>
      )}

      {/* Reviews */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-foreground-muted">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl bg-background-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={review.rating} size="sm" />
                  {review.is_verified_purchase && <Badge variant="success">Verified</Badge>}
                </div>
                {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                {review.body && <p className="text-sm text-foreground-muted">{review.body}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}
