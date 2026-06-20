import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import { formatPrice, getOrderStatusLabel } from '@/lib/utils';
import { CheckCircle, Package, Building2, Truck } from 'lucide-react';

export const metadata = { title: 'Order Confirmed', description: 'Your order has been placed' };

export default async function ConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .eq('user_id', user.id)
    .single();

  if (!order) notFound();

  const { data: bankDetails } = await supabase
    .from('bank_details')
    .select('*')
    .eq('is_active', true);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-foreground-muted">Order #{orderNumber}</p>
      </div>

      <div className="bg-background-card rounded-2xl border border-border p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-foreground-muted">Status:</span><div className="font-medium">{getOrderStatusLabel(order.status)}</div></div>
          <div><span className="text-foreground-muted">Payment:</span><div className="font-medium">{order.payment_method}</div></div>
          <div><span className="text-foreground-muted">Subtotal:</span><div className="font-medium">{formatPrice(order.subtotal)}</div></div>
          <div><span className="text-foreground-muted">Delivery:</span><div className="font-medium">{formatPrice(order.delivery_charge)}</div></div>
          <div><span className="text-foreground-muted">Discount:</span><div className="font-medium">{formatPrice(order.discount)}</div></div>
          <div><span className="text-foreground-muted">Total:</span><div className="font-bold text-lg">{formatPrice(order.total)}</div></div>
        </div>
      </div>

      {order.payment_method === 'bank_transfer' && bankDetails && bankDetails.length > 0 && (
        <div className="bg-background-card rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-bold flex items-center gap-2 mb-4"><Building2 className="w-5 h-5" /> Bank Transfer Details</h2>
          <p className="text-sm text-foreground-muted mb-4">Please transfer the total amount to one of the following bank accounts:</p>
          {bankDetails.map((bank) => (
            <div key={bank.id} className="p-4 rounded-xl bg-background-hover mb-3">
              <div className="font-medium">{bank.bank_name}</div>
              <div className="text-sm text-foreground-muted">Account: {bank.account_name}</div>
              <div className="text-sm text-foreground-muted">Number: {bank.account_number}</div>
              {bank.branch && <div className="text-sm text-foreground-muted">Branch: {bank.branch}</div>}
            </div>
          ))}
          <p className="text-xs text-foreground-muted mt-3">After payment, submit your reference number in your account page.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders"><Button>View Orders</Button></Link>
        <Link href="/track-order"><Button variant="outline"><Package className="w-5 h-5" /> Track Order</Button></Link>
        <Link href="/shop"><Button variant="ghost">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
