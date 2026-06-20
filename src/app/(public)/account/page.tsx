import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, Star, MapPin, LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';

export const metadata = { title: 'My Account', description: 'Your MiniVersePrints account' };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-background-card rounded-2xl border border-border p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-bold">{profile?.first_name} {profile?.last_name}</h2>
            <p className="text-sm text-foreground-muted">{profile?.email}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm text-foreground-muted hover:text-error hover:bg-error/10 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: '/account/profile', icon: User, label: 'Edit Profile', desc: 'Update your personal information' },
            { href: '/account/addresses', icon: MapPin, label: 'Addresses', desc: 'Manage your delivery addresses' },
            { href: '/account/orders', icon: Package, label: 'Orders', desc: 'View your order history' },
            { href: '/account/wishlist', icon: Heart, label: 'Wishlist', desc: 'Your saved products' },
            { href: '/account/reviews', icon: Star, label: 'Reviews', desc: 'Your product reviews' },
            { href: '/track-order', icon: Package, label: 'Track Order', desc: 'Check order status' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-start gap-4 p-4 bg-background-card rounded-2xl border border-border hover:border-accent/50 transition-colors">
              <item.icon className="w-6 h-6 text-accent mt-1" />
              <div><div className="font-medium">{item.label}</div><div className="text-sm text-foreground-muted">{item.desc}</div></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
