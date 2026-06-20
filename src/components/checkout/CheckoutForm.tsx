'use client';

import { useActionState } from 'react';
import { createOrder } from '@/lib/actions/checkout';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { SRI_LANKA_PROVINCES, SRI_LANKA_DISTRICTS, PAYMENT_METHODS } from '@/lib/constants';
import { formatPrice, getEffectivePrice } from '@/lib/utils';
import { CreditCard, Truck, Building2, Store } from 'lucide-react';

interface CheckoutFormProps {
  profile: Record<string, unknown> | null;
  shippingZones: Record<string, unknown>[];
  cart: Record<string, unknown>;
}

export default function CheckoutForm({ profile, shippingZones, cart }: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(async (_prev: { error?: string } | null, formData: FormData) => {
    return await createOrder(formData);
  }, null);

  const items = (cart?.cart_items || []) as Array<Record<string, unknown>>;
  const subtotal = items.reduce((sum: number, item: Record<string, unknown>) => {
    const product = item.product as Record<string, unknown> | null;
    const variation = item.variation as Record<string, unknown> | null;
    const base = product ? getEffectivePrice(product.regular_price as number, product.sale_price as number | null) : 0;
    const adj = (variation?.price_adjustment as number) || 0;
    return sum + Math.max(0, base + adj) * (item.quantity as number);
  }, 0);

  const provinceOptions = SRI_LANKA_PROVINCES.map((p) => ({ value: p, label: p }));

  return (
    <>
      {state?.error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>
      )}
      <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Info */}
          <section className="bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="first_name" name="first_name" label="First Name" defaultValue={(profile?.first_name as string) || ''} required />
              <Input id="last_name" name="last_name" label="Last Name" defaultValue={(profile?.last_name as string) || ''} required />
              <Input id="email" name="email" type="email" label="Email" defaultValue={(profile?.email as string) || ''} required />
              <Input id="phone" name="phone" type="tel" label="Mobile Number" placeholder="07X XXX XXXX" required />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">Delivery Address</h2>
            <div className="space-y-4">
              <Input id="address_line_1" name="address_line_1" label="Address Line 1" required />
              <Input id="address_line_2" name="address_line_2" label="Address Line 2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input id="city" name="city" label="City" required />
                <Select id="province" name="province" label="Province" options={provinceOptions} placeholder="Select Province" required />
                <Input id="district" name="district" label="District" required />
              </div>
              <Input id="postal_code" name="postal_code" label="Postal Code" />
            </div>
          </section>

          {/* Delivery Method */}
          <section className="bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">Delivery Method</h2>
            <div className="space-y-3">
              {shippingZones.map((zone) => {
                const rate = (zone.shipping_rates as Array<Record<string, unknown>>)?.[0];
                return (
                  <label key={zone.id as string} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-accent cursor-pointer transition-colors">
                    <input type="radio" name="shipping_zone_id" value={zone.id as string} className="accent-accent" required />
                    <div className="flex-1">
                      <div className="font-medium">{zone.name as string}</div>
                      <div className="text-sm text-foreground-muted">
                        {rate?.rate_type === 'free' ? 'Free' : `${formatPrice(rate?.base_rate as number || 0)}`}
                        {rate?.estimated_days_min ? ` (${rate.estimated_days_min}-${rate.estimated_days_max} days)` : ''}
                      </div>
                    </div>
                    <div className="font-bold">{rate?.rate_type === 'free' ? 'Free' : formatPrice(rate?.base_rate as number || 0)}</div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'payhere', label: 'PayHere Online Payment', desc: 'Pay securely with card or bank', icon: CreditCard },
                { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Truck },
                { value: 'bank_transfer', label: 'Direct Bank Transfer', desc: 'Transfer to our bank account', icon: Building2 },
                { value: 'store_pickup', label: 'Store Pickup', desc: 'Pick up from our store', icon: Store },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-accent cursor-pointer transition-colors">
                  <input type="radio" name="payment_method" value={method.value} className="accent-accent" required />
                  <method.icon className="w-5 h-5 text-foreground-muted" />
                  <div className="flex-1">
                    <div className="font-medium">{method.label}</div>
                    <div className="text-sm text-foreground-muted">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <Input id="notes" name="notes" label="Order Notes (optional)" />
        </div>

        {/* Order Summary */}
        <div className="bg-background-card rounded-2xl border border-border p-6 h-fit sticky top-20">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-foreground-muted">{(item.product as Record<string, unknown>)?.name as string} x{item.quantity as number}</span>
                <span>{formatPrice(((item.product as Record<string, unknown>)?.regular_price as number) || 0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-foreground-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-foreground-muted">Delivery</span><span>Calculated above</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span><span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full mt-6" isLoading={isPending}>
            Place Order
          </Button>
        </div>
      </form>
    </>
  );
}
