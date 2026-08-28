import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';
import { CUSTOM_ORDER_STATUSES, WHATSAPP_NUMBER } from '@/lib/constants';
import {
  Image as ImageIcon,
  Palette,
  Star,
  Plus,
  ArrowRight,
  MessageCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { getAllGalleryItemsAdmin } from '@/lib/gallery-data';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const galleryItems = await getAllGalleryItemsAdmin();

  // Fetch counts and recent items
  const [
    { count: totalCustomOrders },
    { count: totalReviews },
    { data: recentCustomOrders },
    { data: pendingReviews },
  ] = await Promise.all([
    supabase.from('custom_order_requests').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase
      .from('custom_order_requests')
      .select('id, character_name, name, whatsapp, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('reviews')
      .select('id, rating, title, customer_name:profiles(first_name), created_at')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const statCards = [
    {
      label: 'Gallery Works',
      value: String(galleryItems.length),
      icon: ImageIcon,
      color: 'text-accent',
      bg: 'bg-accent/10',
      href: '/admin/gallery',
    },
    {
      label: 'Custom Orders',
      value: String(totalCustomOrders || 0),
      icon: Palette,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      href: '/admin/custom-orders',
    },
    {
      label: 'Customer Reviews',
      value: String(totalReviews || 0),
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      href: '/admin/reviews',
    },
    {
      label: 'WhatsApp Desk',
      value: WHATSAPP_NUMBER,
      icon: MessageCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      href: `https://wa.me/94782525156`,
      isExternal: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-foreground-muted">
            Manage your 3D printing gallery portfolio, customer custom orders, and reviews.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/gallery/new">
            <Button size="sm" className="bg-accent hover:bg-accent-hover text-white font-bold">
              <Plus className="w-4 h-4 mr-1.5" /> Add Gallery Work
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            target={stat.isExternal ? '_blank' : undefined}
            className="group bg-background-card rounded-3xl border border-border p-5 hover:border-accent/40 transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Main Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Custom Orders */}
        <div className="lg:col-span-7 bg-background-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" /> Recent Custom Orders
            </h2>
            <Link
              href="/admin/custom-orders"
              className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(recentCustomOrders || []).length === 0 ? (
              <p className="text-sm text-foreground-muted text-center py-8">
                No custom order requests yet.
              </p>
            ) : (
              (recentCustomOrders || []).map((order: any) => {
                const statusInfo = CUSTOM_ORDER_STATUSES.find((s) => s.value === order.status);
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-background-secondary border border-border/60 flex items-center justify-between gap-4 hover:border-accent/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {order.character_name}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        From {order.name} · {order.whatsapp}
                      </p>
                      <p className="text-[11px] text-foreground-muted mt-1">
                        {formatDateTime(order.created_at)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full border inline-block"
                        style={{
                          backgroundColor: `${statusInfo?.color || '#3B82F6'}15`,
                          color: statusInfo?.color || '#3B82F6',
                          borderColor: `${statusInfo?.color || '#3B82F6'}30`,
                        }}
                      >
                        {statusInfo?.label || order.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Quick Gallery Highlights */}
        <div className="lg:col-span-5 bg-background-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> Featured Works ({galleryItems.filter(i => i.is_featured).length})
            </h2>
            <Link
              href="/admin/gallery"
              className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
            >
              Manage Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {galleryItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-background-secondary border border-border/60"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                  <span className="text-xs text-accent font-medium">{item.category}</span>
                </div>
                <Link href={`/admin/gallery/${item.id}/edit`}>
                  <Button size="sm" variant="outline" className="text-xs py-1 px-3">
                    Edit
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border">
            <Link href="/admin/gallery/new" className="block">
              <Button className="w-full bg-accent hover:bg-accent-hover text-white">
                <Plus className="w-4 h-4 mr-1.5" /> Add Another Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
