'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { updateCartItem, removeCartItem } from '@/lib/actions/cart';

interface CartItemProps {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  variation?: { size?: string | null; paint_type?: string | null; colour?: string | null } | null;
  price: number;
  quantity: number;
  maxStock?: number | null;
}

export default function CartItem({ id, name, slug, imageUrl, variation, price, quantity, maxStock }: CartItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleQuantity = (newQty: number) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set('id', id);
      formData.set('quantity', String(newQty));
      await updateCartItem(formData);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCartItem(id);
    });
  };

  return (
    <div className="flex gap-4 p-4 bg-background-card rounded-2xl border border-border">
      <a href={`/product/${slug}`} className="w-20 h-20 bg-background-hover rounded-xl flex-shrink-0 overflow-hidden">
        {imageUrl ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" /> : null}
      </a>
      <div className="flex-1 min-w-0">
        <a href={`/product/${slug}`} className="font-medium hover:text-accent transition-colors line-clamp-1">{name}</a>
        {variation && (
          <p className="text-xs text-foreground-muted mt-1">
            {[variation.size, variation.paint_type, variation.colour].filter(Boolean).join(' - ')}
          </p>
        )}
        <p className="text-sm font-bold mt-1">Rs. {(price * quantity).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button onClick={handleRemove} className="p-2 text-foreground-muted hover:text-error transition-colors" disabled={isPending}>
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => handleQuantity(quantity - 1)} className="p-1 rounded-lg hover:bg-background-hover" disabled={isPending || quantity <= 1}>
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button onClick={() => handleQuantity(quantity + 1)} className="p-1 rounded-lg hover:bg-background-hover" disabled={isPending || (maxStock !== null && maxStock !== undefined && quantity >= maxStock)}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
