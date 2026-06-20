import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatPrice, formatDateTime, getOrderStatusLabel } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import OrderActions from './OrderActions';

export const metadata = { title: 'Order Detail - Admin' };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, items:order_items(*), history:order_status_history(*), payment:payments(*)')
    .eq('id', id)
    .single();

  if (!order) notFound();

  const statusColor = ORDER_STATUSES.find(s => s.value === order.status)?.color || '#888';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="p-2 hover:bg-background-hover rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-foreground-muted">{formatDateTime(order.created_at)}</p>
        </div>
        <span className="ml-auto text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-background-card rounded-2xl border border-border p-4">
            <h2 className="font-bold mb-3">Items</h2>
            <div className="space-y-3">
              {(order.items || []).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.product_name}</p>
                    {item.variation_details && <p className="text-xs text-foreground-muted">{item.variation_details}</p>}
                    <p className="text-xs text-foreground-muted">Qty: {item.quantity} x {formatPrice(item.unit_price)}</p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(item.total_price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div className="bg-background-card rounded-2xl border border-border p-4">
            <h2 className="font-bold mb-3">Status History</h2>
            <div className="space-y-3">
              {(order.history || []).map((h: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{getOrderStatusLabel(h.status)}</p>
                    {h.note && <p className="text-xs text-foreground-muted">{h.note}</p>}
                    <p className="text-xs text-foreground-muted">{formatDateTime(h.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer & Address */}
          <div className="bg-background-card rounded-2xl border border-border p-4">
            <h2 className="font-bold mb-3">Customer</h2>
            <p className="text-sm">{order.first_name} {order.last_name}</p>
            <p className="text-sm text-foreground-muted">{order.email}</p>
            <p className="text-sm text-foreground-muted">{order.phone}</p>
            {order.shipping_address && (
              <div className="mt-3 text-sm text-foreground-muted">
                <p className="font-medium text-foreground mb-1">Shipping Address</p>
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(order.shipping_address, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-background-card rounded-2xl border border-border p-4">
            <h2 className="font-bold mb-3">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-foreground-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-foreground-muted">Delivery</span><span>{formatPrice(order.delivery_charge)}</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
            <div className="mt-3 text-sm">
              <p><span className="text-foreground-muted">Payment:</span> {order.payment_method}</p>
              <p><span className="text-foreground-muted">Payment Status:</span> {order.payment_status}</p>
            </div>
          </div>

          {/* Admin Actions */}
          <OrderActions orderId={order.id} currentStatus={order.status} payment={order.payment?.[0]} adminNotes={order.admin_notes} />

          {order.admin_notes && (
            <div className="bg-background-card rounded-2xl border border-border p-4">
              <h2 className="font-bold mb-2">Admin Notes</h2>
              <p className="text-sm text-foreground-muted">{order.admin_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
