import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * PayHere Server Notification Endpoint
 * This endpoint receives payment notifications from PayHere.
 * It verifies the checksum and updates the order status.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const merchant_id = formData.get('merchant_id') as string;
    const order_id = formData.get('order_id') as string;
    const payment_id = formData.get('payment_id') as string;
    const payhere_amount = formData.get('payhere_amount') as string;
    const payhere_currency = formData.get('payhere_currency') as string;
    const status_code = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;
    const method = formData.get('method') as string;
    const custom_1 = formData.get('custom_1') as string;
    const custom_2 = formData.get('custom_2') as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      console.error('PAYHERE_MERCHANT_SECRET not configured');
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    // Verify checksum according to PayHere spec
    // local_md5sig = md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret))
    const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const localHashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${secretHash}`;
    const localMd5sig = crypto.createHash('md5').update(localHashString).digest('hex').toUpperCase();

    if (localMd5sig !== md5sig) {
      console.error('PayHere checksum verification failed');
      return NextResponse.json({ error: 'Invalid checksum' }, { status: 400 });
    }

    // Determine payment status
    const isSuccess = status_code === '2';
    const isPending = status_code === '0';
    const isFailed = status_code === '-1' || status_code === '-2' || status_code === '-3';

    // Save callback for audit
    const supabase = createAdminClient();
    await supabase.from('payment_callbacks').insert({
      order_id: order_id,
      payhere_payment_id: payment_id,
      payhere_method: method,
      status: status_code,
      checksum: md5sig,
      raw_payload: Object.fromEntries(formData.entries()),
      processed: false,
    });

    // Check for duplicate processing
    const { data: existingCallback } = await supabase
      .from('payment_callbacks')
      .select('id, processed')
      .eq('payhere_payment_id', payment_id)
      .eq('processed', true)
      .maybeSingle();

    if (existingCallback) {
      return NextResponse.json({ message: 'Already processed' });
    }

    // Update order and payment
    if (isSuccess) {
      await supabase.from('orders').update({
        payment_status: 'paid',
        status: 'confirmed',
      }).eq('order_number', order_id);

      await supabase.from('payments').update({
        status: 'paid',
        payhere_payment_id: payment_id,
        payhere_checksum: md5sig,
      }).eq('order_id', order_id);

      await supabase.from('order_status_history').insert({
        order_id: order_id,
        status: 'confirmed',
        note: `Payment confirmed via PayHere (ID: ${payment_id})`,
      });
    } else if (isFailed) {
      await supabase.from('payments').update({
        status: 'failed',
        payhere_payment_id: payment_id,
        payhere_checksum: md5sig,
      }).eq('order_id', order_id);

      await supabase.from('orders').update({
        payment_status: 'failed',
      }).eq('order_number', order_id);
    }

    // Mark callback as processed
    await supabase.from('payment_callbacks')
      .update({ processed: true })
      .eq('payhere_payment_id', payment_id);

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('PayHere notification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
