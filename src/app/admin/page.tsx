import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatPrice, formatDateTime, getOrderStatusLabel } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import {
  ShoppingCart, DollarSign, Users, Package, AlertTriangle,
  TrendingUp, Clock, Star,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Dashboard stats
  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalCustomers },
    { data: recentOrders },
    { data: pendingPayments },
    { data: lowStockProducts },
    { data: unapprovedReviews },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('id, order_number, status, total, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('id, order_number, total, created_at').eq('payment_status', 'pending').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, slug, stock_quantity, low_stock_threshold').eq('is_active', true).lt('stock_quantity', 10).limit(5),
    supabase.from('reviews').select('id, rating, title, created_at, product:products(name)').eq('is_approved', false).order('created_at', { ascending: false }).limit(5),
  ]);

  // Calculate total revenue from delivered/completed orders
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total')
    .in('status', ['delivered', 'completed']);
  const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-success' },
    { label: 'Total Orders', value: String(totalOrders || 0), icon: ShoppingCart, color: 'text-blue-400' },
    { label: 'Products', value: String(totalProducts || 0), icon: Package, color: 'text-accent' },
    { label: 'Customers', value: String(totalCustomers || 0), icon: Users, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-background-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-background-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {(recentOrders || []).length === 0 ? (
              <p className="text-sm text-foreground-muted text-center py-4">No orders yet</p>
            ) : (
              (recentOrders || []).map((order: { id: string; order_number: string; status: string; total: number; created_at: string }) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between py-2 hover:bg-background-hover px-2 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-foreground-muted">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-foreground-muted">{getOrderStatusLabel(order.status)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-background-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" /> Pending Payments
            </h2>
          </div>
          <div className="space-y-3">
            {(pendingPayments || []).length === 0 ? (
              <p className="text-sm text-foreground-muted text-center py-4">No pending payments</p>
            ) : (
              (pendingPayments || []).map((order: { id: string; order_number: string; total: number; created_at: string }) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between py-2 hover:bg-background-hover px-2 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-foreground-muted">{formatDateTime(order.created_at)}</p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-background-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" /> Low Stock
            </h2>
            <Link href="/admin/products" className="text-sm text-accent hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {(lowStockProducts || []).length === 0 ? (
              <p className="text-sm text-foreground-muted text-center py-4">All products well stocked</p>
            ) : (
              (lowStockProducts || []).map((product: { id: string; name: string; slug: string; stock_quantity: number; low_stock_threshold: number | null }) => (
                <Link key={product.id} href={`/admin/products/${product.id}/edit`} className="flex items-center justify-between py-2 hover:bg-background-hover px-2 rounded-lg transition-colors">
                  <p className="text-sm font-medium">{product.name}</p>
                  <span className={`text-sm font-bold ${product.stock_quantity <= 0 ? 'text-error' : 'text-yellow-400'}`}>
                    {product.stock_quantity} left
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-background-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> Pending Reviews
            </h2>
            <Link href="/admin/reviews" className="text-sm text-accent hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {(unapprovedReviews || []).length === 0 ? (
              <p className="text-sm text-foreground-muted text-center py-4">No pending reviews</p>
            ) : (
              (unapprovedReviews || []).map((review: any) => (
                <Link key={review.id} href="/admin/reviews" className="flex items-center justify-between py-2 hover:bg-background-hover px-2 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium">{review.product?.name || 'Unknown Product'}</p>
                    <p className="text-xs text-foreground-muted">{review.title || `${review.rating} star review`}</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-foreground-muted'}`} />
                    ))}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
