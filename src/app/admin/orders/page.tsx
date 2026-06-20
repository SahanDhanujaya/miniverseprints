import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatPrice, formatDateTime, getOrderStatusLabel } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import { Search } from 'lucide-react';

export const metadata = { title: 'Orders - Admin' };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('orders').select('id, order_number, status, total, payment_method, payment_status, created_at, first_name, last_name').order('created_at', { ascending: false });
  if (params.status) query = query.eq('status', params.status);
  if (params.q) query = query.ilike('order_number', `%${params.q}%`);

  const { data: orders } = await query;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex gap-3 flex-wrap">
        <form className="flex items-center gap-2 bg-background-card border border-border rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-foreground-muted" />
          <input name="q" defaultValue={params.q} placeholder="Search order number..." className="bg-transparent text-sm outline-none w-48" />
        </form>
        <form>
          <select name="status" defaultValue={params.status || ''} className="bg-background-card border border-border rounded-xl px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </form>
      </div>

      <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Order</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Customer</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Total</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Payment</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((order: any) => (
                <tr key={order.id} className="border-b border-border hover:bg-background-hover transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-accent hover:underline">{order.order_number}</Link>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.first_name} {order.last_name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${order.payment_status === 'paid' ? 'bg-success/10 text-success' : 'bg-yellow-400/10 text-yellow-400'}`}>
                      {order.payment_method} - {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${ORDER_STATUSES.find(s => s.value === order.status)?.color}20`, color: ORDER_STATUSES.find(s => s.value === order.status)?.color }}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">{formatDateTime(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!orders || orders.length === 0) && <div className="text-center py-12 text-foreground-muted">No orders found</div>}
      </div>
    </div>
  );
}
