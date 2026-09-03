import { createAdminClient } from '@/lib/supabase/server';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { demoCategories, demoProducts } from '@/lib/demo-store';
import { Product, Category } from '@/types';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CollectionGrid from '@/components/collection/CollectionGrid';

export const revalidate = 60;

export const metadata = {
  title: 'Full Collection | MiniVersePrints Gallery',
  description: 'Explore our complete catalog of 3D-printed figures, busts, and custom masterworks.',
};

async function getCollectionData() {
  if (!hasSupabaseConfig()) {
    return {
      products: demoProducts as Product[],
      categories: demoCategories as Category[],
    };
  }

  // Fetch all active products and categories via Supabase admin client
  const supabase = createAdminClient();

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_images(*), category:categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  return {
    products: (productsRes.data || []) as Product[],
    categories: (categoriesRes.data || []) as Category[],
  };
}

export default async function CollectionPage() {
  const { products, categories } = await getCollectionData();

  return (
    <main className="min-h-screen bg-black text-white pt-2 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumb items={[{ label: 'Full Collection' }]} />

        {/* Page Header */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
            Atelier Catalog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            The Full Collection
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Browse our complete repertoire of handcrafted 3D prints. Every piece can be inspected in 3D or commissioned with custom scale and hand-painted finishes.
          </p>
        </div>

        {/* Dynamic Interactive Gallery */}
        <CollectionGrid products={products} categories={categories} />
      </div>
    </main>
  );
}