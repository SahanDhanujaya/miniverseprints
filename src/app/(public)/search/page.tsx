import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';

export const metadata = { title: 'Search', description: 'Search MiniVersePrints products' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  let products: Product[] = [];

  if (query) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,short_description.ilike.%${query}%,sku.ilike.%${query}%`)
      .limit(24);
    products = (data || []) as Product[];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Search' }]} />
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : 'Search Products'}
      </h1>
      {query ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-foreground-muted">Enter a search term to find products.</p>
      )}
    </div>
  );
}
