'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
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
    image_url: (formData.get('image_url') as string | null)?.trim() || null,
    model_url: (formData.get('model_url') as string | null)?.trim() || null,
    is_featured: formData.get('is_featured') === 'on',
    is_new_arrival: formData.get('is_new_arrival') === 'on',
    is_best_seller: formData.get('is_best_seller') === 'on',
    is_active: formData.get('is_active') !== 'false',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Use admin client for writes to bypass RLS for server-side admin actions
  const admin = createAdminClient();
  const { data: product, error } = await admin
    .from('products')
    .insert(parsed.data)
    .select('id')
    .single();

  if (error) return { error: error.message };

  // Handle categories (multi-select)
  const categories = formData.getAll('categories') as string[];
  if (categories.length > 0) {
    await admin.from('product_categories').insert(
      categories.map(cat_id => ({ product_id: product.id, category_id: cat_id }))
    );
  }

  // Handle tags
  const tags = formData.getAll('tags') as string[];
  if (tags.length > 0) {
    await admin.from('product_tags').insert(
      tags.map(tag_id => ({ product_id: product.id, tag_id }))
    );
  }

  // Handle uploaded main image(s) from form (name: "image_url")
  const imageUrls = (formData.getAll('image_url') as string[])
    .map((url) => url?.trim())
    .filter(Boolean);

  if (imageUrls.length > 0) {
    const primaryImageUrl = imageUrls[0];
    await admin.from('products').update({ image_url: primaryImageUrl }).eq('id', product.id);
    await admin.from('product_images').insert(
      imageUrls.map((url, idx) => ({ product_id: product.id, url, is_main: idx === 0 }))
    );
  }

  // Handle uploaded 3D model URL (name: "model_url"). Save to products.model_url for first-class access,
  // while keeping the product_attributes fallback for legacy records.
  const modelUrl = (formData.get('model_url') as string | null)?.trim();
  if (modelUrl) {
    await admin.from('products').update({ model_url: modelUrl }).eq('id', product.id);
    await admin.from('product_attributes').upsert(
      { product_id: product.id, name: 'model_url', value: modelUrl },
      { onConflict: 'product_id,name' }
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
    image_url: (formData.get('image_url') as string | null)?.trim() || null,
    model_url: (formData.get('model_url') as string | null)?.trim() || null,
    is_featured: formData.get('is_featured') === 'on',
    is_new_arrival: formData.get('is_new_arrival') === 'on',
    is_best_seller: formData.get('is_best_seller') === 'on',
    is_active: formData.get('is_active') !== 'false',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const admin = createAdminClient();
  const { error } = await admin.from('products').update(parsed.data).eq('id', id);
  if (error) return { error: error.message };

  // Update categories
  await admin.from('product_categories').delete().eq('product_id', id);
  const categories = formData.getAll('categories') as string[];
  if (categories.length > 0) {
    await admin.from('product_categories').insert(
      categories.map(cat_id => ({ product_id: id, category_id: cat_id }))
    );
  }

  // Update tags
  await admin.from('product_tags').delete().eq('product_id', id);
  const tags = formData.getAll('tags') as string[];
  if (tags.length > 0) {
    await admin.from('product_tags').insert(
      tags.map(tag_id => ({ product_id: id, tag_id }))
    );
  }

  // Handle uploaded main image(s) from form (name: "image_url")
  const imageUrls = (formData.getAll('image_url') as string[])
    .map((url) => url?.trim())
    .filter(Boolean);

  if (imageUrls.length > 0) {
    // remove existing images and insert new ones
    await admin.from('product_images').delete().eq('product_id', id);
    await admin.from('product_images').insert(
      imageUrls.map((url, idx) => ({ product_id: id, url, is_main: idx === 0 }))
    );
    await admin.from('products').update({ image_url: imageUrls[0] }).eq('id', id);
  } else if (formData.has('image_url')) {
    // Only clear media when the admin explicitly removes or overwrites the image field.
    await admin.from('product_images').delete().eq('product_id', id);
    await admin.from('products').update({ image_url: null }).eq('id', id);
  }

  // Handle uploaded 3D model URL. Preserve the current model unless a new upload is explicitly provided.
  const modelUrl = (formData.get('model_url') as string | null)?.trim();
  const hasModelInput = formData.has('model_url');
  if (hasModelInput) {
    if (modelUrl) {
      await admin.from('products').update({ model_url: modelUrl }).eq('id', id);
      await admin.from('product_attributes').delete().eq('product_id', id).eq('name', 'model_url');
      await admin.from('product_attributes').insert({ product_id: id, name: 'model_url', value: modelUrl });
    } else {
      await admin.from('products').update({ model_url: null }).eq('id', id);
      await admin.from('product_attributes').delete().eq('product_id', id).eq('name', 'model_url');
    }
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

  const admin = createAdminClient();
  const { error } = await admin.from('products').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  return { success: 'Product deleted.' };
}

export async function adminToggleProductActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  if (!canAccessAdmin(user)) return { error: 'Unauthorized.' };

  const admin = createAdminClient();
  const { error } = await admin.from('products').update({ is_active: isActive }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  return { success: isActive ? 'Product activated.' : 'Product deactivated.' };
}
