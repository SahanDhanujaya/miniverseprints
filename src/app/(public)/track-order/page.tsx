import { createClient } from '@/lib/supabase/server';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import { formatPrice, getOrderStatusLabel, formatDate } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import Link from 'next/link';

export const metadata = { title: 'Track Order', description: 'Track your MiniVersePrints order' };

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ order?: string; email?: string }> }) {
  const params = await searchParams;
  let order: Record<string, unknown> | null = null;
  let statusHistory: Array<Record<string, unknown>> = [];
  let error = '';

  if (params.order && params.email) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', params.order)
      .eq('email', params.email)
      .single();

    if (data) {
      order = data as Record<string, unknown>;
      const { data: history } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: true });
      statusHistory = (history || []) as Array<Record<string, unknown>>;
    } else {
      error = 'Order not found. Please check your order number and email.';
    }
  }

  const statusList = ORDER_STATUSES.map((s) => s.value);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Track Order' }]} />
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

      <form className="bg-background-card rounded-2xl border border-border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Order Number</label>
            <input name="order" type="text" placeholder="MVP-2026-00001" defaultValue={params.order || ''} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" defaultValue={params.email || ''} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>
        </div>
        <button type="submit" className="mt-4 px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors">Track Order</button>
      </form>

      {error && <div className="p-4 bg-error/10 border border-error/30 rounded-xl text-error text-sm mb-6">{error}</div>}

      {order && (
        <div className="space-y-6">
          <div className="bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">Order #{order.order_number as string}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-foreground-muted">Status:</span> <Badge variant={order.status === 'completed' || order.status === 'delivered' ? 'success' : 'info'}>{getOrderStatusLabel(order.status as string)}</Badge></div>
              <div><span className="text-foreground-muted">Total:</span> <span className="font-bold">{formatPrice(order.total as number)}</span></div>
              <div><span className="text-foreground-muted">Payment:</span> {(order.payment_method as string)?.replace('_', ' ')}</div>
              <div><span className="text-foreground-muted">Date:</span> {formatDate(order.created_at as string)}</div>
            </div>
            {!!order.tracking_number && (
              <div className="mt-3 text-sm">
                <span className="text-foreground-muted">Tracking: </span>
                {order.tracking_url ? <a href={order.tracking_url as string} target="_blank" className="text-accent hover:underline">{String(order.tracking_number)}</a> : <span>{String(order.tracking_number)}</span>}
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-background-card rounded-2xl border border-border p-6">
            <h3 className="font-bold mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {statusHistory.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    {i < statusHistory.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4">
                    <div className="font-medium text-sm">{getOrderStatusLabel(entry.status as string)}</div>
                    <div className="text-xs text-foreground-muted">{formatDate(entry.created_at as string)}</div>
                    {entry.note ? <div className="text-xs text-foreground-muted mt-1">{String(entry.note)}</div> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
