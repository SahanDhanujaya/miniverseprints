import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice, getEffectivePrice } from '@/lib/utils';

export const metadata = { title: 'Cart', description: 'Your shopping cart' };

interface CartItemJoined {
  id: string;
  cart_id: string;
  product_id: string;
  variation_id: string | null;
  quantity: number;
  product: { regular_price: number; sale_price: number | null; name: string; slug: string } | null;
  variation: { price_adjustment: number; size: string | null; paint_type: string | null; colour: string | null } | null;
}

function calcItemPrice(item: CartItemJoined): number {
  const base = item.product ? getEffectivePrice(item.product.regular_price, item.product.sale_price) : 0;
  const adj = item.variation?.price_adjustment || 0;
  return Math.max(0, base + adj);
}

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/cart');

  const { data: cart } = await supabase
    .from('carts')
    .select('*, cart_items(*, product:products(regular_price, sale_price, name, slug), variation:product_variations(price_adjustment, size, paint_type, colour))')
    .eq('user_id', user.id)
    .single();

  const items: CartItemJoined[] = (cart?.cart_items || []) as CartItemJoined[];
  const subtotal = items.reduce((sum, item) => sum + calcItemPrice(item) * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="w-12 h-12" />}
          title="Your cart is empty"
          description="Add some awesome 3D figures to your cart!"
          action={<Link href="/shop"><Button>Browse Shop</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-background-card rounded-2xl border border-border">
                <div className="w-20 h-20 bg-background-hover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product?.slug}`} className="font-medium hover:text-accent transition-colors line-clamp-1">
                    {item.product?.name}
                  </Link>
                  {item.variation && (
                    <p className="text-xs text-foreground-muted mt-1">
                      {[item.variation.size, item.variation.paint_type, item.variation.colour].filter(Boolean).join(' - ')}
                    </p>
                  )}
                  <p className="text-sm font-bold mt-1">{formatPrice(calcItemPrice(item))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded-lg hover:bg-background-hover"><Minus className="w-4 h-4" /></button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button className="p-1 rounded-lg hover:bg-background-hover"><Plus className="w-4 h-4" /></button>
                </div>
                <button className="p-2 text-foreground-muted hover:text-error transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
          </div>

          <div className="bg-background-card rounded-2xl border border-border p-6 h-fit sticky top-20">
            <h3 className="font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-foreground-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-foreground-muted">Delivery</span><span>Calculated at checkout</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout"><Button size="lg" className="w-full mt-6">Proceed to Checkout</Button></Link>
            <Link href="/shop" className="block text-center text-sm text-accent hover:underline mt-3">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
