import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import { formatPrice, getOrderStatusLabel, formatDate } from '@/lib/utils';

export const metadata = { title: 'My Orders', description: 'Your order history' };

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Orders' }]} />
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {!orders?.length ? (
        <p className="text-foreground-muted">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block p-4 bg-background-card rounded-2xl border border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">#{order.order_number}</div>
                  <div className="text-sm text-foreground-muted">{formatDate(order.created_at)}</div>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === 'completed' ? 'success' : 'info'}>{getOrderStatusLabel(order.status)}</Badge>
                  <div className="font-bold mt-1">{formatPrice(order.total)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
