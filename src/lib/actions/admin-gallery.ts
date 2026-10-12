'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function isAdmin(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } | null) {
  return user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin';
}

export async function adminCreateGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const mediaUrl = String(formData.get('media_url') || '').trim();
  if (!mediaUrl) return { error: 'Please upload a photo or video.' };

  const { error } = await supabase.from('gallery_items').insert({
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim() || null,
    media_url: mediaUrl,
    media_type: formData.get('media_type') === 'video' ? 'video' : 'image',
    category: formData.get('category') === 'printing_process' ? 'printing_process' : 'final_output',
    sort_order: Number(formData.get('sort_order') || 0),
    is_active: formData.get('is_active') !== 'false',
  });

  if (error) {
    if (error.code === 'PGRST205' || error.message.includes("gallery_items")) {
      return { error: 'Gallery database table is not installed. Apply supabase/migrations/006_gallery_items.sql in Supabase SQL Editor, then refresh this page.' };
    }
    return { error: error.message };
  }
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return { success: 'Gallery item added.' };
}

export async function adminDeleteGalleryItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) {
    if (error.code === 'PGRST205' || error.message.includes("gallery_items")) {
      return { error: 'Gallery database table is not installed. Apply supabase/migrations/006_gallery_items.sql in Supabase SQL Editor, then refresh this page.' };
    }
    return { error: error.message };
  }
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return { success: 'Gallery item deleted.' };
}
