'use client';

import { useState } from 'react';
import { formatPrice, getEffectivePrice, getVariationPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { ShoppingCart, MessageCircle, Heart, Share2 } from 'lucide-react';
import { addToCart } from '@/lib/actions/cart';
import { toggleWishlist } from '@/lib/actions/wishlist';
import { getProductEnquiryLink } from '@/lib/utils';

interface Variation {
  id: string;
  sku?: string | null;
  size?: string | null;
  height?: number | null;
  colour?: string | null;
  paint_type?: string | null;
  material?: string | null;
  finish?: string | null;
  price_adjustment: number;
  stock_quantity?: number | null;
  image_url?: string | null;
  production_lead_time_days?: number | null;
  is_active: boolean;
}

interface ProductVariationsProps {
  productId: string;
  productName: string;
  productSlug: string;
  regularPrice: number;
  salePrice: number | null;
  variations: Variation[];
  productType: string;
  stockQuantity: number;
}

export default function ProductVariations({
  productId, productName, productSlug, regularPrice, salePrice, variations, productType, stockQuantity,
}: ProductVariationsProps) {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [wishlisted, setWishlisted] = useState(false);

  const basePrice = getEffectivePrice(regularPrice, salePrice);
  const currentPrice = selectedVariation ? getVariationPrice(basePrice, selectedVariation.price_adjustment) : basePrice;

  // Get unique options for each attribute
  const sizes = [...new Set(variations.filter(v => v.size).map(v => v.size!))];
  const colours = [...new Set(variations.filter(v => v.colour).map(v => v.colour!))];
  const paintTypes = [...new Set(variations.filter(v => v.paint_type).map(v => v.paint_type!))];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [selectedPaint, setSelectedPaint] = useState<string | null>(null);

  // Find matching variation
  const matchingVariation = variations.find(v =>
    (!selectedSize || v.size === selectedSize) &&
    (!selectedColour || v.colour === selectedColour) &&
    (!selectedPaint || v.paint_type === selectedPaint) &&
    v.is_active
  ) || null;

  const handleAddToCart = async () => {
    const formData = new FormData();
    formData.set('product_id', productId);
    if (matchingVariation) formData.set('variation_id', matchingVariation.id);
    formData.set('quantity', String(quantity));
    const result = await addToCart(formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleWishlist = async () => {
    const result = await toggleWishlist(productId);
    if (result.wishlisted !== undefined) {
      setWishlisted(result.wishlisted);
    }
  };

  const maxStock = matchingVariation ? (matchingVariation.stock_quantity ?? 99) : (productType === 'ready_stock' ? stockQuantity : 99);
  const outOfStock = matchingVariation ? (matchingVariation.stock_quantity != null && matchingVariation.stock_quantity <= 0) : (productType === 'ready_stock' && stockQuantity <= 0);

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
        {salePrice && salePrice < regularPrice && !selectedVariation && (
          <span className="text-lg text-foreground-muted line-through">{formatPrice(regularPrice)}</span>
        )}
        {selectedVariation && salePrice && salePrice < regularPrice && (
          <span className="text-lg text-foreground-muted line-through">{formatPrice(regularPrice + selectedVariation.price_adjustment)}</span>
        )}
      </div>

      {/* Stock status */}
      {productType === 'made_to_order' ? (
        <p className="text-sm text-accent font-medium">Made to Order{(matchingVariation?.production_lead_time_days) ? ` - ${matchingVariation.production_lead_time_days} days` : ''}</p>
      ) : outOfStock ? (
        <p className="text-sm text-error font-medium">Out of Stock</p>
      ) : maxStock <= 5 ? (
        <p className="text-sm text-warning font-medium">Only {maxStock} left in stock!</p>
      ) : (
        <p className="text-sm text-success font-medium">In Stock</p>
      )}

      {/* Variation selectors */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  selectedSize === size ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-foreground-muted'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colours.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Colour</label>
          <div className="flex flex-wrap gap-2">
            {colours.map(colour => (
              <button
                key={colour}
                onClick={() => setSelectedColour(selectedColour === colour ? null : colour)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  selectedColour === colour ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-foreground-muted'
                }`}
              >
                {colour}
              </button>
            ))}
          </div>
        </div>
      )}

      {paintTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Paint Type</label>
          <div className="flex flex-wrap gap-2">
            {paintTypes.map(pt => (
              <button
                key={pt}
                onClick={() => setSelectedPaint(selectedPaint === pt ? null : pt)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  selectedPaint === pt ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-foreground-muted'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center gap-3">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-background-hover">-</button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-background-hover">+</button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {message.text}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button size="lg" onClick={handleAddToCart} disabled={outOfStock} className="flex-1">
          <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
        </Button>
        <Button size="lg" variant="outline" onClick={handleToggleWishlist}>
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-accent text-accent' : ''}`} />
        </Button>
      </div>

      <div className="flex gap-3">
        <a href={getProductEnquiryLink(productName, `${process.env.NEXT_PUBLIC_SITE_URL || 'https://miniverseprints.lk'}/product/${productSlug}`)} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button size="lg" variant="outline" className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Enquiry
          </Button>
        </a>
      </div>
    </div>
  );
}
