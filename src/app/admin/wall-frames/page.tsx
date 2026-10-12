import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { Frame, Plus } from 'lucide-react';

export const metadata = { title: '3D Wall Frames - Admin' };

export default async function AdminWallFramesPage() {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, description')
    .eq('slug', '3d-wall-frames')
    .maybeSingle();

  let products: any[] = [];
  if (category) {
    const { data: links } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', category.id);
    const ids = (links || []).map((link) => link.product_id);

    if (ids.length > 0) {
      const { data } = await supabase
        .from('products')
        .select('id, name, regular_price, sale_price, stock_quantity, is_active, product_images(url, is_main, sort_order)')
        .in('id', ids)
        .order('created_at', { ascending: false });
      products = data || [];
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Frame className="w-6 h-6 text-accent" /> 3D Wall Frames</h1>
          <p className="text-sm text-foreground-muted mt-1">Add and manage wall-frame products, photos, prices, and stock.</p>
        </div>
        <Link href="/admin/products/new?category=3d-wall-frames" className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-semibold text-black hover:bg-accent-hover transition-colors">
          <Plus className="w-4 h-4" /> Add Wall Frame
        </Link>
      </div>

      {!category && (
        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
          The 3D Wall Frames category is not in Supabase yet. Run migration <code>005_add_wall_frames_category.sql</code> or create the category with slug <code>3d-wall-frames</code> in Admin → Categories.
        </div>
      )}

      <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-sm text-foreground-muted">Product</th>
              <th className="text-left px-4 py-3 text-sm text-foreground-muted">Price</th>
              <th className="text-left px-4 py-3 text-sm text-foreground-muted">Stock</th>
              <th className="text-left px-4 py-3 text-sm text-foreground-muted">Status</th>
              <th className="text-left px-4 py-3 text-sm text-foreground-muted">Action</th>
            </tr></thead>
            <tbody>
              {products.map((product) => {
                const images = product.product_images || [];
                const image = images.find((item: any) => item.is_main) || images[0];
                return (
                  <tr key={product.id} className="border-b border-border hover:bg-background-hover">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-background-hover overflow-hidden">{image?.url && <img src={image.url} alt="" className="w-full h-full object-cover" />}</div><span className="font-medium">{product.name}</span></div></td>
                    <td className="px-4 py-3">{formatPrice(product.sale_price || product.regular_price)}</td>
                    <td className="px-4 py-3">{product.stock_quantity}</td>
                    <td className="px-4 py-3"><span className={product.is_active ? 'text-success' : 'text-error'}>{product.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-3"><Link href={`/admin/products/${product.id}/edit`} className="text-accent hover:underline">Edit</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <div className="text-center py-12 text-foreground-muted">No wall frames added yet.</div>}
      </div>
    </div>
  );
}
