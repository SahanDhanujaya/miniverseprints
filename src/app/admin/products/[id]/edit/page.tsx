import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/app/admin/products/new/ProductForm';

export const metadata = { title: 'Edit Product - Admin' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, categories:product_category(category:categories(id, name)), tags:product_tags(tag_id)')
    .eq('id', id)
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name');
  const { data: tags } = await supabase.from('tags').select('id, name').order('name');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 hover:bg-background-hover rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <ProductForm categories={categories || []} tags={tags || []} product={product} />
    </div>
  );
}
