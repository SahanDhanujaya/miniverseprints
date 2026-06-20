'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { reviewSchema, reviewReportSchema } from '@/lib/validations/review';
import { rateLimitReview } from '@/lib/rate-limit';

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in to submit a review.' };

  const limit = rateLimitReview(user.id);
  if (!limit.success) return { error: 'Too many review submissions. Please try again later.' };

  const raw = {
    product_id: formData.get('product_id') as string,
    rating: parseInt(formData.get('rating') as string),
    title: formData.get('title') as string,
    body: formData.get('body') as string || undefined,
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Check user has a delivered/completed order for this product
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_items!inner(product_id)')
    .eq('user_id', user.id)
    .in('status', ['delivered', 'completed']);

  const hasPurchased = orders?.some(o =>
    o.order_items?.some((item: { product_id: string }) => item.product_id === parsed.data.product_id)
  );

  // Check not already reviewed
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', parsed.data.product_id)
    .maybeSingle();

  if (existing) return { error: 'You have already reviewed this product.' };

  const { error } = await supabase
    .from('reviews')
    .insert({
      product_id: parsed.data.product_id,
      user_id: user.id,
      rating: parsed.data.rating,
      title: parsed.data.title,
      body: parsed.data.body || null,
      is_verified_purchase: !!hasPurchased,
      is_approved: false,
    });

  if (error) return { error: 'Failed to submit review. It will be visible after approval.' };

  revalidatePath(`/product/${parsed.data.product_id}`);
  return { success: 'Review submitted! It will be visible after approval.' };
}

export async function reportReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in to report a review.' };

  const raw = {
    review_id: formData.get('review_id') as string,
    reason: formData.get('reason') as string,
  };

  const parsed = reviewReportSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from('review_reports')
    .insert({
      review_id: parsed.data.review_id,
      reporter_id: user.id,
      reason: parsed.data.reason,
    });

  if (error) return { error: 'Failed to report review.' };
  return { success: 'Review reported. Thank you.' };
}
