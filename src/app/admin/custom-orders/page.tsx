import { createClient } from '@/lib/supabase/server';
import { formatDateTime, formatPrice } from '@/lib/utils';
import { CUSTOM_ORDER_STATUSES } from '@/lib/constants';
import CustomOrderActions from './CustomOrderActions';

export const metadata = { title: 'Custom Orders - Admin' };

export default async function AdminCustomOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from('custom_order_requests').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Custom Orders</h1>
      <div className="space-y-4">
        {(orders || []).map((order: any) => {
          const statusInfo = CUSTOM_ORDER_STATUSES.find(s => s.value === order.status);
          return (
            <div key={order.id} className="bg-background-card rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold">{order.character_name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${statusInfo?.color}20`, color: statusInfo?.color }}>
                      {statusInfo?.label || order.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted">From: {order.name} ({order.email})</p>
                  <p className="text-sm text-foreground-muted">WhatsApp: {order.whatsapp}</p>
                  {order.size && <p className="text-sm">Size: {order.size}</p>}
                  {order.paint_type && <p className="text-sm">Paint: {order.paint_type}</p>}
                  {order.budget && <p className="text-sm">Budget: {formatPrice(order.budget)}</p>}
                  {order.required_date && <p className="text-sm">Required by: {order.required_date}</p>}
                  <p className="text-sm mt-2">{order.description}</p>
                  <p className="text-xs text-foreground-muted mt-2">{formatDateTime(order.created_at)}</p>
                </div>
                <CustomOrderActions orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          );
        })}
        {(!orders || orders.length === 0) && <div className="text-center py-12 text-foreground-muted">No custom order requests</div>}
      </div>
    </div>
  );
}
