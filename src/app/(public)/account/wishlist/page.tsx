import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';

export const metadata = { title: 'Wishlist', description: 'Your saved products' };

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: wishlists } = await supabase.from('wishlists').select('*, product:products(*, product_images(*))').eq('user_id', user.id);
  const products = (wishlists || []).map((w: Record<string, unknown>) => w.product).filter(Boolean) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Wishlist' }]} />
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <ProductGrid products={products} />
    </div>
  );
}
