import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Plus, Search } from 'lucide-react';

export const metadata = { title: 'Products - Admin' };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; type?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('id, name, slug, regular_price, sale_price, stock_quantity, product_type, is_active, is_featured, is_new_arrival, is_best_seller, categories:product_category(category:categories(name)), images:product_images(url, is_main, sort_order)')
    .order('created_at', { ascending: false });

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`);
  }
  if (params.type) {
    query = query.eq('product_type', params.type);
  }

  const { data: products } = await query;
  const { data: categories } = await supabase.from('categories').select('id, name').eq('is_active', true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <form className="flex items-center gap-2 bg-background-card border border-border rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-foreground-muted" />
          <input name="q" defaultValue={params.q} placeholder="Search products..." className="bg-transparent text-sm outline-none w-48" />
        </form>
        <form className="flex items-center gap-2">
          <select name="type" defaultValue={params.type || ''} className="bg-background-card border border-border rounded-xl px-3 py-2 text-sm">
            <option value="">All Types</option>
            <option value="ready_stock">Ready Stock</option>
            <option value="made_to_order">Made to Order</option>
          </select>
        </form>
      </div>

      {/* Product list */}
      <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Product</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Price</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((product: any) => (
                <tr key={product.id} className="border-b border-border hover:bg-background-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-background-hover overflow-hidden flex-shrink-0">
                        {product.images?.[0]?.url && <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-foreground-muted">{product.categories?.[0]?.category?.name || 'Uncategorized'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{formatPrice(product.regular_price)}</p>
                    {product.sale_price && <p className="text-xs text-accent">{formatPrice(product.sale_price)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${product.stock_quantity <= 0 ? 'text-error' : product.stock_quantity <= 5 ? 'text-yellow-400' : 'text-success'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-background-hover">
                      {product.product_type === 'ready_stock' ? 'Ready Stock' : 'Made to Order'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-sm text-accent hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-foreground-muted">No products found</div>
        )}
      </div>
    </div>
  );
}
