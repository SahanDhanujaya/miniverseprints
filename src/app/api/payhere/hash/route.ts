import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { order_id, amount, currency } = await request.json();

    if (!order_id || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const mode = process.env.PAYHERE_MODE || 'sandbox';

    if (!merchantId || !merchantSecret) {
      return NextResponse.json({ error: 'PayHere not configured' }, { status: 500 });
    }

    // Generate hash according to PayHere spec
    // Hash = md5(merchant_id + order_id + amount_formatted + currency + md5(merchant_secret))
    const formattedAmount = parseFloat(amount).toFixed(2);
    const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hashString = `${merchantId}${order_id}${formattedAmount}${currency}${secretHash}`;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    const payhereUrl = mode === 'sandbox'
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';

    return NextResponse.json({
      merchant_id: merchantId,
      hash,
      payhere_url: payhereUrl,
      mode,
    });
  } catch (error) {
    console.error('PayHere hash generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
