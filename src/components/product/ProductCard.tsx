'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
import { Product } from '@/types';
import { getProductEnquiryLink, truncate } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productImages = product.images?.length ? product.images : product.product_images || [];
  const mainImage = productImages.find((img) => img.is_main) || productImages[0];
  return (
    <div className="product-card reveal-on-scroll group relative bg-background-card rounded-2xl border border-border overflow-hidden transition-all duration-300">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-background-hover">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(246,215,173,0.22),transparent_32%),linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.16)_48%,transparent_66%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-shimmer" />
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt_text || product.name}
            fill
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-background-hover flex items-center justify-center">
            <span className="text-foreground-muted text-sm">No Image</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new_arrival && <Badge variant="info">New</Badge>}
          {product.is_best_seller && <Badge variant="accent">Best Seller</Badge>}
          {product.sale_price && product.sale_price < product.regular_price && (
            <Badge variant="error">Sale</Badge>
          )}
          {product.product_type === 'made_to_order' && <Badge variant="warning">Made to Order</Badge>}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {product.short_description && (
          <p className="text-xs text-foreground-muted mb-2 line-clamp-2">
            {truncate(product.short_description, 80)}
          </p>
        )}
        <PriceDisplay
          regularPrice={product.regular_price}
          salePrice={product.sale_price}
          size="sm"
        />

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3">
          <Link
            href={`/product/${product.slug}`}
            className="magnetic-button flex-1 text-center py-2 text-xs font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            View Details
          </Link>
          <a
            href={getProductEnquiryLink(product.name, `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-green-500/20 text-green-500 transition-colors"
            title="WhatsApp Enquiry"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            className="p-2 rounded-lg hover:bg-accent/20 text-foreground-muted hover:text-accent transition-colors"
            title="Add to Wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-background-hover text-foreground-muted transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
