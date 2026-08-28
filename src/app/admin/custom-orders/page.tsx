import { createClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/utils';
import { CUSTOM_ORDER_STATUSES } from '@/lib/constants';
import CustomOrderActions from './CustomOrderActions';
import { Palette, Calendar, User, Phone, Mail, FileText } from 'lucide-react';

export const metadata = {
  title: 'Custom Orders Inbox - Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminCustomOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('custom_order_requests')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Custom Orders Inbox</h1>
        <p className="text-sm text-foreground-muted">
          Manage and review customer requests submitted through the custom 3D printing form.
        </p>
      </div>

      <div className="space-y-4">
        {(orders || []).map((order: any) => {
          const statusInfo = CUSTOM_ORDER_STATUSES.find((s) => s.value === order.status);
          return (
            <div
              key={order.id}
              className="bg-background-card rounded-3xl border border-border p-6 shadow-sm hover:border-border/80 transition-all flex flex-col lg:flex-row justify-between gap-6"
            >
              {/* Order Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold text-xl text-foreground">
                    {order.character_name}
                  </h3>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${statusInfo?.color || '#3B82F6'}15`,
                      color: statusInfo?.color || '#3B82F6',
                      borderColor: `${statusInfo?.color || '#3B82F6'}30`,
                    }}
                  >
                    {statusInfo?.label || order.status}
                  </span>
                  <span className="text-xs text-foreground-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateTime(order.created_at)}
                  </span>
                </div>

                {/* Customer Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-background-secondary border border-border/50 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-accent" />
                    <span className="text-foreground font-medium">{order.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-foreground font-medium">{order.whatsapp}</span>
                  </div>
                  {order.email && order.email !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-accent" />
                      <span className="text-foreground-muted truncate">{order.email}</span>
                    </div>
                  )}
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-4 text-xs text-foreground-muted">
                  {order.size && (
                    <div><strong>Size:</strong> {order.size}</div>
                  )}
                  {order.paint_type && (
                    <div><strong>Finish:</strong> {order.paint_type}</div>
                  )}
                  {order.budget && (
                    <div><strong>Budget:</strong> {order.budget}</div>
                  )}
                  {order.required_date && (
                    <div><strong>Needed by:</strong> {order.required_date}</div>
                  )}
                </div>

                {/* Description */}
                {order.description && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">
                      Customer Description / Reference Notes:
                    </p>
                    <p className="text-sm bg-background p-3.5 rounded-xl border border-border text-foreground-muted leading-relaxed">
                      {order.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions & WhatsApp Contact */}
              <CustomOrderActions
                orderId={order.id}
                currentStatus={order.status}
                customerName={order.name}
                customerWhatsApp={order.whatsapp}
                characterName={order.character_name}
              />
            </div>
          );
        })}

        {(!orders || orders.length === 0) && (
          <div className="text-center py-16 bg-background-card rounded-3xl border border-border p-8 space-y-3">
            <Palette className="w-12 h-12 text-accent/40 mx-auto" />
            <h3 className="text-lg font-bold">No custom order requests yet</h3>
            <p className="text-sm text-foreground-muted max-w-sm mx-auto">
              When customers fill out the custom 3D printing form, their orders will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
