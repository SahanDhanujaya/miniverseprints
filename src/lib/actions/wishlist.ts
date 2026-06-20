'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in to manage your wishlist.' };

  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('wishlists').delete().eq('id', existing.id);
    if (error) return { error: 'Failed to remove from wishlist.' };
    revalidatePath('/account/wishlist');
    return { success: 'Removed from wishlist.', wishlisted: false };
  }

  const { error } = await supabase
    .from('wishlists')
    .insert({ user_id: user.id, product_id: productId });

  if (error) return { error: 'Failed to add to wishlist.' };
  revalidatePath('/account/wishlist');
  return { success: 'Added to wishlist!', wishlisted: true };
}

export async function removeFromWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId);

  if (error) return { error: 'Failed to remove from wishlist.' };
  revalidatePath('/account/wishlist');
  return { success: 'Removed from wishlist.' };
}
