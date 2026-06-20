import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  deliveryCharge?: number | null;
  total?: number;
  showCheckout?: boolean;
}

export default function CartSummary({ subtotal, discount = 0, deliveryCharge, total, showCheckout = true }: CartSummaryProps) {
  const calculatedTotal = total ?? (subtotal - discount + (deliveryCharge || 0));

  return (
    <div className="bg-background-card rounded-2xl border border-border p-6 h-fit sticky top-20">
      <h3 className="font-bold mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground-muted">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-foreground-muted">Delivery</span>
          <span>{deliveryCharge !== null && deliveryCharge !== undefined ? formatPrice(deliveryCharge) : 'Calculated at checkout'}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(calculatedTotal)}</span>
        </div>
      </div>
    </div>
  );
}
