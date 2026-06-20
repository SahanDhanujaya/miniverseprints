'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cartItemSchema, updateCartItemSchema, couponCodeSchema } from '@/lib/validations/cart';

export async function addToCart(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in to add items to your cart.' };

  const raw = {
    product_id: formData.get('product_id') as string,
    variation_id: (formData.get('variation_id') as string) || undefined,
    quantity: parseInt(formData.get('quantity') as string) || 1,
  };

  const parsed = cartItemSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Check product exists and is active
  const { data: product } = await supabase
    .from('products')
    .select('id, is_active, stock_quantity, product_type, name')
    .eq('id', parsed.data.product_id)
    .single();

  if (!product || !product.is_active) return { error: 'Product not available.' };

  // Check variation if provided
  if (parsed.data.variation_id) {
    const { data: variation } = await supabase
      .from('product_variations')
      .select('id, is_active, stock_quantity')
      .eq('id', parsed.data.variation_id)
      .single();

    if (!variation || !variation.is_active) return { error: 'Selected variation not available.' };
    if (variation.stock_quantity !== null && variation.stock_quantity < parsed.data.quantity) {
      return { error: 'Insufficient stock for selected variation.' };
    }
  } else if (product.product_type === 'ready_stock' && product.stock_quantity < parsed.data.quantity) {
    return { error: 'Insufficient stock.' };
  }

  // Get or create cart
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!cart) {
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single();
    if (error) return { error: 'Failed to create cart.' };
    cart = newCart;
  }

  // Check if same product+variation already in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', parsed.data.product_id)
    .eq(parsed.data.variation_id ? 'variation_id' : 'product_id', parsed.data.variation_id || parsed.data.product_id)
    .maybeSingle();

  if (existing && parsed.data.variation_id) {
    // Check with variation_id specifically
    const { data: existingWithVariation } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', parsed.data.product_id)
      .eq('variation_id', parsed.data.variation_id)
      .maybeSingle();

    if (existingWithVariation) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingWithVariation.quantity + parsed.data.quantity })
        .eq('id', existingWithVariation.id);
      if (error) return { error: 'Failed to update cart item.' };
      revalidatePath('/cart');
      return { success: `${product.name} quantity updated in cart.` };
    }
  } else if (existing && !parsed.data.variation_id) {
    const { data: existingNoVariation } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', parsed.data.product_id)
      .is('variation_id', null)
      .maybeSingle();

    if (existingNoVariation) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingNoVariation.quantity + parsed.data.quantity })
        .eq('id', existingNoVariation.id);
      if (error) return { error: 'Failed to update cart item.' };
      revalidatePath('/cart');
      return { success: `${product.name} quantity updated in cart.` };
    }
  }

  const { error } = await supabase
    .from('cart_items')
    .insert({
      cart_id: cart.id,
      product_id: parsed.data.product_id,
      variation_id: parsed.data.variation_id || null,
      quantity: parsed.data.quantity,
    });

  if (error) return { error: 'Failed to add item to cart.' };

  revalidatePath('/cart');
  return { success: `${product.name} added to cart!` };
}

export async function updateCartItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const raw = {
    id: formData.get('id') as string,
    quantity: parseInt(formData.get('quantity') as string),
  };

  const parsed = updateCartItemSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (parsed.data.quantity <= 0) {
    return removeCartItem(parsed.data.id);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity: parsed.data.quantity })
    .eq('id', parsed.data.id);

  if (error) return { error: 'Failed to update quantity.' };

  revalidatePath('/cart');
  return { success: 'Cart updated.' };
}

export async function removeCartItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) return { error: 'Failed to remove item.' };

  revalidatePath('/cart');
  return { success: 'Item removed from cart.' };
}

export async function applyCoupon(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in to apply coupons.' };

  const raw = { code: formData.get('code') as string };
  const parsed = couponCodeSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const code = parsed.data.code.toUpperCase();

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (!coupon) return { error: 'Invalid coupon code.' };

  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) return { error: 'This coupon is not yet active.' };
  if (coupon.expires_at && new Date(coupon.expires_at) < now) return { error: 'This coupon has expired.' };
  if (coupon.usage_limit !== null) {
    const { count } = await supabase.from('coupon_usage').select('*', { count: 'exact', head: true }).eq('coupon_id', coupon.id);
    if (count !== null && count >= coupon.usage_limit) return { error: 'This coupon has reached its usage limit.' };
  }
  if (coupon.per_customer_limit !== null) {
    const { count } = await supabase.from('coupon_usage').select('*', { count: 'exact', head: true }).eq('coupon_id', coupon.id).eq('user_id', user.id);
    if (count !== null && count >= coupon.per_customer_limit) return { error: 'You have reached the usage limit for this coupon.' };
  }

  // Save coupon to cart
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
  if (!cart) return { error: 'No cart found.' };

  const { error } = await supabase.from('carts').update({ coupon_code: code }).eq('id', cart.id);
  if (error) return { error: 'Failed to apply coupon.' };

  revalidatePath('/cart');
  revalidatePath('/checkout');
  return { success: `Coupon "${code}" applied!`, coupon };
}

export async function removeCoupon() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
  if (!cart) return { error: 'No cart found.' };

  const { error } = await supabase.from('carts').update({ coupon_code: null }).eq('id', cart.id);
  if (error) return { error: 'Failed to remove coupon.' };

  revalidatePath('/cart');
  revalidatePath('/checkout');
  return { success: 'Coupon removed.' };
}
