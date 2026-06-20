'use server';

import { createClient } from '@/lib/supabase/server';
import { checkoutSchema } from '@/lib/validations/checkout';
import { rateLimitCheckout } from '@/lib/rate-limit';
import { generateOrderNumber, getEffectivePrice } from '@/lib/utils';
import { calculateCheckoutTotals, validateReadyStock, type PricingCartItem } from '@/lib/checkout-calculations';
import { buildOrderInsert } from '@/lib/order-creation';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Please login to place an order' };
  }

  // Rate limit
  const limit = rateLimitCheckout(user.id);
  if (!limit.success) {
    return { error: 'Too many order attempts. Please wait and try again.' };
  }

  // Get cart
  const { data: cart } = await supabase
    .from('carts')
    .select('*, cart_items(*, product:products(id, name, slug, regular_price, sale_price, product_type, stock_quantity), variation:product_variations(id, price_adjustment, stock_quantity, size, paint_type, colour))')
    .eq('user_id', user.id)
    .single();

  if (!cart?.cart_items?.length) {
    return { error: 'Your cart is empty' };
  }

  // Parse checkout data
  const raw = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  const pricingItems: PricingCartItem[] = (cart.cart_items as Array<Record<string, unknown>>).map((item) => {
    const product = item.product as Record<string, unknown> | null;
    const variation = item.variation as Record<string, unknown> | null;
    return {
      quantity: item.quantity as number,
      product: {
        name: (product?.name as string) || 'Unknown Product',
        regular_price: (product?.regular_price as number) || 0,
        sale_price: (product?.sale_price as number | null) ?? null,
        product_type: (product?.product_type as 'ready_stock' | 'made_to_order') || 'ready_stock',
        stock_quantity: (product?.stock_quantity as number) || 0,
      },
      variation: variation ? {
        price_adjustment: (variation.price_adjustment as number) || 0,
        stock_quantity: (variation.stock_quantity as number) || 0,
      } : null,
    };
  });

  const stockError = validateReadyStock(pricingItems);
  if (stockError) return { error: stockError };

  // Get shipping rate
  const { data: shippingRate } = await supabase
    .from('shipping_rates')
    .select('*')
    .eq('zone_id', data.shipping_zone_id)
    .single();

  const totals = calculateCheckoutTotals(pricingItems, shippingRate);

  // Generate order number
  const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const orderNumber = generateOrderNumber((count || 0) + 1);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(buildOrderInsert(data, orderNumber, user.id, totals))
    .select()
    .single();

  if (orderError || !order) {
    return { error: 'Failed to create order. Please try again.' };
  }

  // Create order items
  const orderItems = (cart.cart_items as Array<Record<string, unknown>>).map((item) => {
    const product = item.product as Record<string, unknown> | null;
    const variation = item.variation as Record<string, unknown> | null;
    const basePrice = getEffectivePrice(
      (product?.regular_price as number) || 0,
      (product?.sale_price as number | null) ?? null
    );
    const adj = (variation?.price_adjustment as number) || 0;
    const unitPrice = Math.max(0, basePrice + adj);

    return {
      order_id: order.id,
      product_id: item.product_id,
      variation_id: item.variation_id,
      product_name: (product?.name as string) || 'Unknown Product',
      variation_details: variation ? {
        size: variation.size,
        paint_type: variation.paint_type,
        colour: variation.colour,
      } : null,
      quantity: item.quantity as number,
      unit_price: unitPrice,
      total_price: unitPrice * (item.quantity as number),
    };
  });

  await supabase.from('order_items').insert(orderItems);

  // Create status history
  await supabase.from('order_status_history').insert({
    order_id: order.id,
    status: order.status,
    note: 'Order created',
    created_by: user.id,
  });

  // Create payment record
  await supabase.from('payments').insert({
    order_id: order.id,
    method: data.payment_method,
    status: 'pending',
    amount: totals.total,
  });

  // Clear cart
  await supabase.from('cart_items').delete().eq('cart_id', cart.id);

  revalidatePath('/cart');
  redirect(`/checkout/confirmation/${orderNumber}`);
}

export async function submitBankPayment(orderId: string, bankReference: string, paymentSlipUrl?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('payments')
    .update({
      bank_reference: bankReference,
      payment_slip_url: paymentSlipUrl,
      status: 'verifying',
    })
    .eq('order_id', orderId);

  if (error) return { error: 'Failed to submit payment details' };

  await supabase
    .from('orders')
    .update({ payment_status: 'verifying', status: 'payment_verification' })
    .eq('id', orderId);

  revalidatePath('/account/orders');
  return { success: 'Payment details submitted for verification' };
}
