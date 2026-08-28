import { createClient } from '@/lib/supabase/server';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { demoGalleryItems } from './demo-gallery';
import type { GalleryItem } from '@/types';

export async function getGalleryItems(options?: {
  category?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<GalleryItem[]> {
  if (!hasSupabaseConfig()) {
    let items = [...demoGalleryItems];
    if (options?.category && options.category !== 'All') {
      items = items.filter((i) => i.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.featuredOnly) {
      items = items.filter((i) => i.is_featured);
    }
    items.sort((a, b) => a.sort_order - b.sort_order);
    if (options?.limit) {
      items = items.slice(0, options.limit);
    }
    return items;
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (options?.category && options.category !== 'All') {
      query = query.eq('category', options.category);
    }
    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback to demo items
      let items = [...demoGalleryItems];
      if (options?.category && options.category !== 'All') {
        items = items.filter((i) => i.category.toLowerCase() === options.category?.toLowerCase());
      }
      if (options?.featuredOnly) {
        items = items.filter((i) => i.is_featured);
      }
      if (options?.limit) {
        items = items.slice(0, options.limit);
      }
      return items;
    }

    return data as GalleryItem[];
  } catch {
    return demoGalleryItems;
  }
}

export async function getAllGalleryItemsAdmin(): Promise<GalleryItem[]> {
  if (!hasSupabaseConfig()) {
    return demoGalleryItems;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return demoGalleryItems;
    }

    return data as GalleryItem[];
  } catch {
    return demoGalleryItems;
  }
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  if (!hasSupabaseConfig()) {
    return demoGalleryItems.find((i) => i.id === id) || null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return demoGalleryItems.find((i) => i.id === id) || null;
    }

    return data as GalleryItem;
  } catch {
    return demoGalleryItems.find((i) => i.id === id) || null;
  }
}
