import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Palette,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { canAccessAdmin } from '@/lib/permissions';
import { getAdminSession } from '@/lib/auth-session';

export const metadata = {
  title: 'Admin Dashboard - MiniVersePrints',
  description: 'Manage gallery portfolio, custom orders, reviews, and store settings',
  robots: { index: false, follow: false },
};

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/gallery', label: 'Gallery Manager', icon: ImageIcon },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: Palette },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check admin session cookie first
  const adminSession = await getAdminSession();

  let user = null;
  let profile = null;

  if (!adminSession) {
    // If no admin cookie, check Supabase user
    try {
      const supabase = await createClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data?.user;

      if (!user || !canAccessAdmin(user)) {
        redirect('/admin/login');
      }

      const profRes = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      profile = profRes.data;
    } catch {
      redirect('/admin/login');
    }
  }

  const displayName = adminSession?.name || profile?.first_name || user?.user_metadata?.first_name || 'Chaniya';
  const displayEmail = adminSession?.email || user?.email || 'chaniyarvc@gmail.com';
  const initial = displayName[0].toUpperCase();

  return (
    <div className="flex h-screen bg-[#EFE7DC] text-[#1F150E]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#221811] text-[#FAF7F2] border-r border-[#38281E] flex-shrink-0">
        <div className="p-5 border-b border-[#38281E]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 border border-white/30 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="MiniVersePrints Logo"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white">
                Mini<span className="text-[#F59E0B]">Verse</span>
              </span>
              <span className="block text-[10px] text-[#F59E0B] font-bold tracking-widest uppercase flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" /> Admin Studio
              </span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs uppercase tracking-wider font-bold text-[#D6C7B7] hover:text-white hover:bg-white/10 transition-colors"
            >
              <item.icon className="w-4 h-4 text-[#F59E0B]" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#38281E] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#D6C7B7] hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 bg-[#2D2017] rounded-xl border border-[#3E2E22]">
            <div className="w-8 h-8 rounded-full bg-[#A34E17] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-[#A89887] truncate">{displayEmail}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#D6C7B7] hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with mobile menu */}
        <header className="h-14 border-b border-[#D5C5B5] bg-[#FAF6F0] flex items-center px-4 gap-4 flex-shrink-0">
          <label htmlFor="admin-mobile-menu" className="lg:hidden p-2 hover:bg-[#EFE7DC] rounded-lg cursor-pointer">
            <Menu className="w-5 h-5" />
          </label>
          <div className="flex-1" />
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-[#A34E17] hover:underline flex items-center gap-1.5">
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        {/* Mobile sidebar toggle */}
        <input type="checkbox" id="admin-mobile-menu" className="hidden peer" />
        <div className="fixed inset-0 bg-black/60 z-50 hidden peer-checked:block lg:hidden">
          <label htmlFor="admin-mobile-menu" className="absolute inset-0" />
          <aside className="relative w-64 h-full bg-[#221811] text-[#FAF7F2] border-r border-[#38281E] flex flex-col">
            <div className="p-4 border-b border-[#38281E] flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-lg overflow-hidden bg-white p-0.5">
                  <Image src="/images/logo.png" alt="Logo" fill sizes="24px" className="object-contain" />
                </div>
                <span className="font-serif font-bold text-lg text-white">MiniVerse</span>
              </Link>
              <label htmlFor="admin-mobile-menu" className="p-2 hover:bg-white/10 rounded-lg cursor-pointer text-[#D6C7B7]">
                <X className="w-5 h-5" />
              </label>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold text-[#D6C7B7] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-[#F59E0B]" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#EFE7DC]">
          {children}
        </main>
      </div>
    </div>
  );
}
