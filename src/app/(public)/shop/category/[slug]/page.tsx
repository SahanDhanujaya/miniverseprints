import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Product } from '@/types';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { getDemoCategoryBySlug, getDemoProductsByCategorySlug } from '@/lib/demo-store';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasSupabaseConfig()) {
    const category = getDemoCategoryBySlug(slug);
    if (!category) return { title: 'Category Not Found' };
    return { title: category.name, description: category.description };
  }

  const supabase = await createClient();
  const { data: category } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (!category) return { title: 'Category Not Found' };
  return { title: category.seo_title || category.name, description: category.seo_description || category.description };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  void sp;

  if (!hasSupabaseConfig()) {
    const category = getDemoCategoryBySlug(slug);
    if (!category) notFound();

    return (
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: category.name }]} />
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && <p className="text-foreground-muted mb-8">{category.description}</p>}
        <ProductGrid products={getDemoProductsByCategorySlug(slug)} />
      </div>
    );
  }

  const supabase = await createClient();

  const { data: category } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (!category) notFound();

  const { data: productIds } = await supabase.from('product_categories').select('product_id').eq('category_id', category.id);
  const ids = (productIds || []).map((p) => p.product_id);

  const { data: products } = ids.length > 0
    ? await supabase.from('products').select('*, product_images(*)').in('id', ids).eq('is_active', true)
    : { data: [] };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: category.name }]} />
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && <p className="text-foreground-muted mb-8">{category.description}</p>}
      <ProductGrid products={(products || []) as Product[]} />
    </div>
  );
}
