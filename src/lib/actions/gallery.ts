'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { canAccessAdmin } from '@/lib/permissions';

export async function createGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !canAccessAdmin(user)) {
    return { error: 'Unauthorized. Admin access required.' };
  }

  const title = formData.get('title') as string;
  const category = (formData.get('category') as string) || 'Figures';
  const description = (formData.get('description') as string) || '';
  const dimensions = (formData.get('dimensions') as string) || null;
  const material = (formData.get('material') as string) || 'PLA / Resin';
  const sort_order = parseInt(formData.get('sort_order') as string, 10) || 0;
  const is_featured = formData.get('is_featured') === 'true' || formData.get('is_featured') === 'on';
  const rawTags = (formData.get('tags') as string) || '';
  const tags = rawTags
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  let image_url = (formData.get('image_url') as string) || '';

  // Handle uploaded file if provided
  const imageFile = formData.get('image_file') as File | null;
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
        upsert: true,
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      image_url = publicUrlData.publicUrl;
    }
  }

  if (!title) {
    return { error: 'Item title is required.' };
  }

  if (!image_url) {
    return { error: 'An image file or image URL is required.' };
  }

  const { error } = await supabase.from('gallery_items').insert({
    title,
    category,
    image_url,
    description,
    dimensions,
    material,
    sort_order,
    is_featured,
    is_active: true,
    tags,
  });

  if (error) {
    return { error: error.message || 'Failed to create gallery item.' };
  }

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  revalidatePath('/');

  return { success: true };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !canAccessAdmin(user)) {
    return { error: 'Unauthorized. Admin access required.' };
  }

  const title = formData.get('title') as string;
  const category = (formData.get('category') as string) || 'Figures';
  const description = (formData.get('description') as string) || '';
  const dimensions = (formData.get('dimensions') as string) || null;
  const material = (formData.get('material') as string) || 'PLA / Resin';
  const sort_order = parseInt(formData.get('sort_order') as string, 10) || 0;
  const is_featured = formData.get('is_featured') === 'true' || formData.get('is_featured') === 'on';
  const is_active = formData.get('is_active') === 'true' || formData.get('is_active') === 'on';
  const rawTags = (formData.get('tags') as string) || '';
  const tags = rawTags
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  let image_url = (formData.get('image_url') as string) || '';

  // Handle uploaded file if provided
  const imageFile = formData.get('image_file') as File | null;
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
        upsert: true,
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      image_url = publicUrlData.publicUrl;
    }
  }

  const updatePayload: Record<string, any> = {
    title,
    category,
    description,
    dimensions,
    material,
    sort_order,
    is_featured,
    is_active,
    tags,
  };

  if (image_url) {
    updatePayload.image_url = image_url;
  }

  const { error } = await supabase
    .from('gallery_items')
    .update(updatePayload)
    .eq('id', id);

  if (error) {
    return { error: error.message || 'Failed to update gallery item.' };
  }

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  revalidatePath('/');

  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !canAccessAdmin(user)) {
    return { error: 'Unauthorized. Admin access required.' };
  }

  const { error } = await supabase.from('gallery_items').delete().eq('id', id);

  if (error) {
    return { error: error.message || 'Failed to delete gallery item.' };
  }

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  revalidatePath('/');

  return { success: true };
}

export async function toggleGalleryItemFeatured(id: string, is_featured: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !canAccessAdmin(user)) {
    return { error: 'Unauthorized. Admin access required.' };
  }

  const { error } = await supabase
    .from('gallery_items')
    .update({ is_featured })
    .eq('id', id);

  if (error) {
    return { error: error.message || 'Failed to toggle featured state.' };
  }

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  revalidatePath('/');

  return { success: true };
}
