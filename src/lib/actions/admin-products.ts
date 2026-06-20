'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { productSchema } from '@/lib/validations/product';
import { slugify } from '@/lib/utils';
import { canAccessAdmin } from '@/lib/permissions';

export async function adminCreateProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  // Check admin via user metadata
  if (!canAccessAdmin(user)) return { error: 'Unauthorized.' };

  const raw = {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('name') as string),
    sku: formData.get('sku') as string || undefined,
    short_description: formData.get('short_description') as string || undefined,
    full_description: formData.get('full_description') as string || undefined,
    regular_price: parseFloat(formData.get('regular_price') as string),
    sale_price: formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : undefined,
    category_id: formData.get('category_id') as string,
    stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
    product_type: formData.get('product_type') as string || 'ready_stock',
    production_lead_time_days: parseInt(formData.get('production_lead_time_days') as string) || undefined,
    material: formData.get('material') as string || undefined,
    is_featured: formData.get('is_featured') === 'on',
    is_new_arrival: formData.get('is_new_arrival') === 'on',
    is_best_seller: formData.get('is_best_seller') === 'on',
    is_active: formData.get('is_active') !== 'false',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: product, error } = await supabase
    .from('products')
    .insert(parsed.data)
    .select('id')
    .single();

  if (error) return { error: error.message };

  // Handle categories (multi-select)
  const categories = formData.getAll('categories') as string[];
  if (categories.length > 0) {
    await supabase.from('product_categories').insert(
      categories.map(cat_id => ({ product_id: product.id, category_id: cat_id }))
    );
  }

  // Handle tags
  const tags = formData.getAll('tags') as string[];
  if (tags.length > 0) {
    await supabase.from('product_tags').insert(
      tags.map(tag_id => ({ product_id: product.id, tag_id }))
    );
  }

  revalidatePath('/admin/products');
  return { success: 'Product created!', productId: product.id };
}

export async function adminUpdateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  if (!canAccessAdmin(user)) return { error: 'Unauthorized.' };

  const raw = {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('name') as string),
    sku: formData.get('sku') as string || undefined,
    short_description: formData.get('short_description') as string || undefined,
    full_description: formData.get('full_description') as string || undefined,
    regular_price: parseFloat(formData.get('regular_price') as string),
    sale_price: formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : undefined,
    category_id: formData.get('category_id') as string,
    stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
    product_type: formData.get('product_type') as string || 'ready_stock',
    production_lead_time_days: parseInt(formData.get('production_lead_time_days') as string) || undefined,
    material: formData.get('material') as string || undefined,
    is_featured: formData.get('is_featured') === 'on',
    is_new_arrival: formData.get('is_new_arrival') === 'on',
    is_best_seller: formData.get('is_best_seller') === 'on',
    is_active: formData.get('is_active') !== 'false',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from('products').update(parsed.data).eq('id', id);
  if (error) return { error: error.message };

  // Update categories
  await supabase.from('product_categories').delete().eq('product_id', id);
  const categories = formData.getAll('categories') as string[];
  if (categories.length > 0) {
    await supabase.from('product_categories').insert(
      categories.map(cat_id => ({ product_id: id, category_id: cat_id }))
    );
  }

  // Update tags
  await supabase.from('product_tags').delete().eq('product_id', id);
  const tags = formData.getAll('tags') as string[];
  if (tags.length > 0) {
    await supabase.from('product_tags').insert(
      tags.map(tag_id => ({ product_id: id, tag_id }))
    );
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  return { success: 'Product updated!' };
}

export async function adminDeleteProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  if (!canAccessAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  return { success: 'Product deleted.' };
}

export async function adminToggleProductActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  if (!canAccessAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('products').update({ is_active: isActive }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  return { success: isActive ? 'Product activated.' : 'Product deactivated.' };
}
