'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function requireAdmin(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } | null): string | null {
  if (!user) return 'Not authenticated.';
  const role = (user.app_metadata?.role || user.user_metadata?.role) as string | undefined;
  if (role !== 'admin') return 'Unauthorized.';
  return null;
}

export async function adminUpdateOrderStatus(orderId: string, status: string, note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const err = requireAdmin(user);
  if (err) return { error: err };

  // Update order status
  const { error: orderError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (orderError) return { error: orderError.message };

  // Add status history entry
  const { error: historyError } = await supabase
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status,
      note: note || null,
      created_by: user!.id,
    });
  if (historyError) return { error: historyError.message };

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: `Order status updated to ${status}.` };
}

export async function adminAddOrderNote(orderId: string, note: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const err = requireAdmin(user);
  if (err) return { error: err };

  const { error } = await supabase
    .from('orders')
    .update({ admin_notes: note })
    .eq('id', orderId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: 'Note added.' };
}

export async function adminVerifyBankPayment(orderId: string, paymentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const err = requireAdmin(user);
  if (err) return { error: err };

  // Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({ status: 'verified', verified_by: user!.id, verified_at: new Date().toISOString() })
    .eq('id', paymentId);
  if (paymentError) return { error: paymentError.message };

  // Update order status to confirmed
  const { error: orderError } = await supabase
    .from('orders')
    .update({ status: 'confirmed', payment_status: 'paid' })
    .eq('id', orderId);
  if (orderError) return { error: orderError.message };

  // Add status history
  await supabase.from('order_status_history').insert({
    order_id: orderId,
    status: 'confirmed',
    note: 'Bank transfer payment verified.',
    created_by: user!.id,
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: 'Bank payment verified. Order confirmed.' };
}

export async function adminAddTracking(orderId: string, courier: string, trackingNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const err = requireAdmin(user);
  if (err) return { error: err };

  const { error } = await supabase
    .from('orders')
    .update({ courier, tracking_number: trackingNumber, status: 'dispatched' })
    .eq('id', orderId);
  if (error) return { error: error.message };

  await supabase.from('order_status_history').insert({
    order_id: orderId,
    status: 'dispatched',
    note: `Shipped via ${courier}. Tracking: ${trackingNumber}`,
    created_by: user!.id,
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: 'Tracking info added. Order marked as dispatched.' };
}
