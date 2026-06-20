import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, FolderOpen, Tags, ShoppingCart, Users,
  Star, Ticket, Truck, Settings, Image, Palette, LogOut, Menu, X,
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { canAccessAdmin } from '@/lib/permissions';

export const metadata = {
  title: 'Admin Dashboard - MiniVersePrints',
  description: 'Admin dashboard for managing MiniVersePrints store',
  robots: { index: false, follow: false },
};

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/tags', label: 'Tags', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/shipping', label: 'Shipping', icon: Truck },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: Palette },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/admin');

  if (!canAccessAdmin(user)) redirect('/');

  const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-background-secondary border-r border-border flex-shrink-0">
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <Package className="w-7 h-7 text-accent" />
            <span className="text-lg font-bold">
              Mini<span className="text-accent">Verse</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
              {(profile?.first_name?.[0] || 'A').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.first_name || 'Admin'}</p>
              <p className="text-xs text-foreground-muted truncate">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground-muted hover:text-error hover:bg-error/5 transition-colors">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with mobile menu */}
        <header className="h-14 border-b border-border bg-background-secondary flex items-center px-4 gap-4 flex-shrink-0">
          <label htmlFor="admin-mobile-menu" className="lg:hidden p-2 hover:bg-background-hover rounded-lg cursor-pointer">
            <Menu className="w-5 h-5" />
          </label>
          <div className="flex-1" />
          <Link href="/" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
            View Store →
          </Link>
        </header>

        {/* Mobile sidebar toggle (CSS-only) */}
        <input type="checkbox" id="admin-mobile-menu" className="hidden peer" />
        <div className="fixed inset-0 bg-black/60 z-50 hidden peer-checked:block lg:hidden">
          <label htmlFor="admin-mobile-menu" className="absolute inset-0" />
          <aside className="relative w-64 h-full bg-background-secondary border-r border-border flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <Package className="w-7 h-7 text-accent" />
                <span className="text-lg font-bold">Mini<span className="text-accent">Verse</span></span>
              </Link>
              <label htmlFor="admin-mobile-menu" className="p-2 hover:bg-background-hover rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </label>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                  onClick={() => { const el = document.getElementById('admin-mobile-menu') as HTMLInputElement | null; if (el) el.checked = false; }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
