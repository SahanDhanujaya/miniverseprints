import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import { formatPrice, getOrderStatusLabel, formatDate } from '@/lib/utils';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: order } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).eq('user_id', user.id).single();
  if (!order) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Orders', href: '/account/orders' }, { label: order.order_number }]} />
      <h1 className="text-2xl font-bold mb-6">Order #{order.order_number}</h1>
      <div className="bg-background-card rounded-2xl border border-border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-foreground-muted">Status:</span> <Badge variant="info">{getOrderStatusLabel(order.status)}</Badge></div>
          <div><span className="text-foreground-muted">Payment:</span> {order.payment_method}</div>
          <div><span className="text-foreground-muted">Total:</span> <span className="font-bold">{formatPrice(order.total)}</span></div>
          <div><span className="text-foreground-muted">Date:</span> {formatDate(order.created_at)}</div>
        </div>
        <div className="border-t border-border pt-4">
          <h3 className="font-bold mb-3">Items</h3>
          {order.order_items?.map((item: Record<string, unknown>) => (
            <div key={item.id as string} className="flex justify-between py-2 text-sm">
              <span>{item.product_name as string} x{item.quantity as number}</span>
              <span>{formatPrice(item.total_price as number)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
