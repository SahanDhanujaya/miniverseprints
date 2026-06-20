import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from './ProductForm';

export const metadata = { title: 'Add Product - Admin' };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name');
  const { data: tags } = await supabase.from('tags').select('id, name').order('name');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 hover:bg-background-hover rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold">Add Product</h1>
      </div>
      <ProductForm categories={categories || []} tags={tags || []} />
    </div>
  );
}
