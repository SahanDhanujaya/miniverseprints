'use client';

import { formatPrice, getEffectivePrice, getDiscountPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  regularPrice: number;
  salePrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
}

export default function PriceDisplay({ regularPrice, salePrice, size = 'md', showDiscount = true }: PriceDisplayProps) {
  const effectivePrice = getEffectivePrice(regularPrice, salePrice ?? null);
  const hasDiscount = salePrice && salePrice < regularPrice;
  const discountPct = hasDiscount ? getDiscountPercentage(regularPrice, salePrice!) : 0;

  const sizes = {
    sm: { main: 'text-sm', original: 'text-xs' },
    md: { main: 'text-lg', original: 'text-sm' },
    lg: { main: 'text-2xl', original: 'text-base' },
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={cn('font-bold text-foreground', sizes[size].main)}>
        {formatPrice(effectivePrice)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn('line-through text-foreground-muted', sizes[size].original)}>
            {formatPrice(regularPrice)}
          </span>
          {showDiscount && discountPct > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-accent/20 text-accent rounded-lg">
              -{discountPct}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
