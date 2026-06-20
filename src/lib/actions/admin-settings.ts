'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';

function isAdmin(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const role = (user.app_metadata?.role || user.user_metadata?.role) as string | undefined;
  return role === 'admin';
}

// ==================== CATEGORIES ====================

export async function adminCreateCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const name = formData.get('name') as string;
  const data = {
    name,
    slug: (formData.get('slug') as string) || slugify(name),
    description: formData.get('description') as string || null,
    parent_id: (formData.get('parent_id') as string) || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('categories').insert(data);
  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  return { success: 'Category created!' };
}

export async function adminUpdateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const name = formData.get('name') as string;
  const data = {
    name,
    slug: (formData.get('slug') as string) || slugify(name),
    description: formData.get('description') as string || null,
    parent_id: (formData.get('parent_id') as string) || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('categories').update(data).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  return { success: 'Category updated!' };
}

export async function adminDeleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  return { success: 'Category deleted.' };
}

// ==================== TAGS ====================

export async function adminCreateTag(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const name = formData.get('name') as string;
  const { error } = await supabase.from('tags').insert({ name, slug: slugify(name) });
  if (error) return { error: error.message };

  revalidatePath('/admin/tags');
  return { success: 'Tag created!' };
}

export async function adminDeleteTag(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/tags');
  return { success: 'Tag deleted.' };
}

// ==================== REVIEWS ====================

export async function adminApproveReview(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/reviews');
  return { success: 'Review approved.' };
}

export async function adminRejectReview(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/reviews');
  return { success: 'Review rejected and removed.' };
}

export async function adminReplyReview(id: string, reply: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('reviews').update({
    admin_reply: reply,
    admin_reply_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/reviews');
  return { success: 'Reply added.' };
}

// ==================== COUPONS ====================

export async function adminCreateCoupon(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const data = {
    code: (formData.get('code') as string).toUpperCase(),
    type: formData.get('type') as string,
    value: parseFloat(formData.get('value') as string),
    min_order_amount: formData.get('min_order_amount') ? parseFloat(formData.get('min_order_amount') as string) : null,
    max_order_amount: formData.get('max_order_amount') ? parseFloat(formData.get('max_order_amount') as string) : null,
    usage_limit: formData.get('usage_limit') ? parseInt(formData.get('usage_limit') as string) : null,
    per_customer_limit: formData.get('per_customer_limit') ? parseInt(formData.get('per_customer_limit') as string) : null,
    starts_at: formData.get('starts_at') as string || null,
    expires_at: formData.get('expires_at') as string || null,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('coupons').insert(data);
  if (error) return { error: error.message };

  revalidatePath('/admin/coupons');
  return { success: 'Coupon created!' };
}

export async function adminUpdateCoupon(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const data = {
    code: (formData.get('code') as string).toUpperCase(),
    type: formData.get('type') as string,
    value: parseFloat(formData.get('value') as string),
    min_order_amount: formData.get('min_order_amount') ? parseFloat(formData.get('min_order_amount') as string) : null,
    max_order_amount: formData.get('max_order_amount') ? parseFloat(formData.get('max_order_amount') as string) : null,
    usage_limit: formData.get('usage_limit') ? parseInt(formData.get('usage_limit') as string) : null,
    per_customer_limit: formData.get('per_customer_limit') ? parseInt(formData.get('per_customer_limit') as string) : null,
    starts_at: formData.get('starts_at') as string || null,
    expires_at: formData.get('expires_at') as string || null,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('coupons').update(data).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/coupons');
  return { success: 'Coupon updated!' };
}

export async function adminDeleteCoupon(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/coupons');
  return { success: 'Coupon deleted.' };
}

// ==================== SHIPPING ====================

export async function adminCreateShippingZone(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const districts = (formData.get('districts') as string).split(',').map(d => d.trim()).filter(Boolean);
  const { data: zone, error } = await supabase.from('shipping_zones').insert({
    name: formData.get('name') as string,
    districts,
    is_active: formData.get('is_active') !== 'false',
  }).select('id').single();

  if (error) return { error: error.message };

  // Create default rate
  await supabase.from('shipping_rates').insert({
    zone_id: zone.id,
    rate_type: formData.get('rate_type') as string || 'flat',
    base_rate: parseFloat(formData.get('base_rate') as string) || 0,
    per_kg_rate: formData.get('per_kg_rate') ? parseFloat(formData.get('per_kg_rate') as string) : null,
    free_delivery_threshold: formData.get('free_delivery_threshold') ? parseFloat(formData.get('free_delivery_threshold') as string) : null,
    estimated_days_min: parseInt(formData.get('estimated_days_min') as string) || 1,
    estimated_days_max: parseInt(formData.get('estimated_days_max') as string) || 3,
  });

  revalidatePath('/admin/shipping');
  return { success: 'Shipping zone created!' };
}

export async function adminDeleteShippingZone(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  await supabase.from('shipping_rates').delete().eq('zone_id', id);
  const { error } = await supabase.from('shipping_zones').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/shipping');
  return { success: 'Shipping zone deleted.' };
}

// ==================== SETTINGS ====================

export async function adminUpdateSetting(key: string, value: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
  if (error) return { error: error.message };

  revalidatePath('/admin/settings');
  return { success: 'Setting updated.' };
}

export async function adminUpdateBankDetail(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const data = {
    bank_name: formData.get('bank_name') as string,
    account_name: formData.get('account_name') as string,
    account_number: formData.get('account_number') as string,
    branch: formData.get('branch') as string || null,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('bank_details').update(data).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/settings');
  return { success: 'Bank details updated.' };
}

export async function adminCreateBankDetail(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const data = {
    bank_name: formData.get('bank_name') as string,
    account_name: formData.get('account_name') as string,
    account_number: formData.get('account_number') as string,
    branch: formData.get('branch') as string || null,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('bank_details').insert(data);
  if (error) return { error: error.message };

  revalidatePath('/admin/settings');
  return { success: 'Bank details added.' };
}

// ==================== BANNERS ====================

export async function adminCreateBanner(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const data = {
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string || null,
    image_url: formData.get('image_url') as string,
    link_url: formData.get('link_url') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('homepage_banners').insert(data);
  if (error) return { error: error.message };

  revalidatePath('/admin/banners');
  return { success: 'Banner created!' };
}

export async function adminUpdateBanner(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const data = {
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string || null,
    image_url: formData.get('image_url') as string,
    link_url: formData.get('link_url') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    is_active: formData.get('is_active') !== 'false',
  };

  const { error } = await supabase.from('homepage_banners').update(data).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/banners');
  return { success: 'Banner updated!' };
}

export async function adminDeleteBanner(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('homepage_banners').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/banners');
  return { success: 'Banner deleted.' };
}

// ==================== CUSTOM ORDERS ====================

export async function adminUpdateCustomOrderStatus(id: string, status: string, note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('custom_order_requests').update({ status }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/custom-orders');
  return { success: `Custom order status updated to ${status}.` };
}

export async function adminSubmitCustomOrderQuotation(id: string, price: number, notes: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { error: 'Unauthorized.' };

  const { error } = await supabase.from('custom_order_requests').update({
    status: 'quotation_sent',
    budget: price,
  }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/custom-orders');
  return { success: 'Quotation sent.' };
}
