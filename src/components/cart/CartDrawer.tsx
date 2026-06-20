'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

interface CartItemJoined {
  id: string;
  product_id: string;
  variation_id: string | null;
  quantity: number;
  product: { regular_price: number; sale_price: number | null; name: string; slug: string } | null;
  variation: { price_adjustment: number; size: string | null; paint_type: string | null; colour: string | null } | null;
}

export default function CartDrawer({ items, open, onClose }: { items: CartItemJoined[]; open: boolean; onClose: () => void }) {
  if (!open) return null;

  const subtotal = items.reduce((sum, item) => {
    const base = item.product ? (item.product.sale_price && item.product.sale_price < item.product.regular_price ? item.product.sale_price : item.product.regular_price) : 0;
    const adj = item.variation?.price_adjustment || 0;
    return sum + (base + adj) * item.quantity;
  }, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background-secondary border-l border-border z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">Cart ({items.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-background-hover rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-foreground-muted text-center py-8">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-background-card rounded-xl border border-border">
                <div className="w-16 h-16 bg-background-hover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product?.slug}`} className="text-sm font-medium hover:text-accent line-clamp-1">{item.product?.name}</Link>
                  {item.variation && (
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {[item.variation.size, item.variation.paint_type, item.variation.colour].filter(Boolean).join(' - ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold">Rs. {((item.product ? (item.product.sale_price && item.product.sale_price < item.product.regular_price ? item.product.sale_price : item.product.regular_price) + (item.variation?.price_adjustment || 0) : 0) * item.quantity).toLocaleString()}</span>
                    <span className="text-xs text-foreground-muted">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs. {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
            <Link href="/cart" onClick={onClose} className="block w-full py-3 bg-accent text-white text-center rounded-xl font-bold hover:bg-accent-hover transition-colors">View Cart</Link>
            <Link href="/checkout" onClick={onClose} className="block w-full py-3 bg-background-card border border-border text-center rounded-xl font-medium hover:bg-background-hover transition-colors">Checkout</Link>
          </div>
        )}
      </div>
    </>
  );
}
