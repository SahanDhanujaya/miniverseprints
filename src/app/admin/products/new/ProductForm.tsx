'use client';

import { useActionState } from 'react';
import { adminCreateProduct } from '@/lib/actions/admin-products';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PRODUCT_TYPES } from '@/lib/constants';

interface ProductFormProps {
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  product?: any;
}

export default function ProductForm({ categories, tags, product }: ProductFormProps) {
  const isEdit = !!product;
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    if (isEdit) {
      const { adminUpdateProduct } = await import('@/lib/actions/admin-products');
      return adminUpdateProduct(product.id, formData);
    }
    return adminCreateProduct(formData);
  }, null);

  return (
    <>
      {state?.error && <div className="p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4 bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold">Basic Information</h2>
            <Input id="name" name="name" label="Product Name" defaultValue={product?.name || ''} required />
            <Input id="slug" name="slug" label="Slug (auto-generated if empty)" defaultValue={product?.slug || ''} />
            <Input id="sku" name="sku" label="SKU" defaultValue={product?.sku || ''} />
            <div>
              <label htmlFor="short_description" className="block text-sm font-medium mb-1">Short Description</label>
              <textarea id="short_description" name="short_description" rows={2} defaultValue={product?.short_description || ''} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="full_description" className="block text-sm font-medium mb-1">Full Description</label>
              <textarea id="full_description" name="full_description" rows={5} defaultValue={product?.full_description || ''} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm" />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold">Pricing & Stock</h2>
            <Input id="regular_price" name="regular_price" type="number" step="0.01" label="Regular Price (LKR)" defaultValue={product?.regular_price || ''} required />
            <Input id="sale_price" name="sale_price" type="number" step="0.01" label="Sale Price (LKR)" defaultValue={product?.sale_price || ''} />
            <Input id="stock_quantity" name="stock_quantity" type="number" label="Stock Quantity" defaultValue={product?.stock_quantity ?? '0'} />
            <div>
              <label htmlFor="product_type" className="block text-sm font-medium mb-1">Product Type</label>
              <select id="product_type" name="product_type" defaultValue={product?.product_type || 'ready_stock'} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm">
                {PRODUCT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <Input id="production_lead_time_days" name="production_lead_time_days" type="number" label="Production Lead Time (days)" defaultValue={product?.production_lead_time_days || ''} />
            <Input id="material" name="material" label="Material" defaultValue={product?.material || ''} />
          </div>

          {/* Categories & Tags */}
          <div className="space-y-4 bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold">Categories & Tags</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Categories</label>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm py-1">
                    <input type="checkbox" name="categories" value={cat.id} defaultChecked={product?.categories?.some((c: any) => c.category?.id === cat.id)} className="rounded" />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-2 text-sm py-1">
                    <input type="checkbox" name="tags" value={tag.id} defaultChecked={product?.tags?.some((t: any) => t.id === tag.id)} className="rounded" />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-4 bg-background-card rounded-2xl border border-border p-6">
            <h2 className="font-bold">Visibility & Flags</h2>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="is_active" defaultChecked={product?.is_active !== false} className="rounded" />
              Active (visible in store)
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured || false} className="rounded" />
              Featured
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="is_new_arrival" defaultChecked={product?.is_new_arrival || false} className="rounded" />
              New Arrival
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="is_best_seller" defaultChecked={product?.is_best_seller || false} className="rounded" />
              Best Seller
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" isLoading={isPending}>{isEdit ? 'Update Product' : 'Create Product'}</Button>
          <a href="/admin/products" className="px-4 py-2 border border-border rounded-xl text-sm hover:bg-background-hover transition-colors">Cancel</a>
        </div>
      </form>
    </>
  );
}
