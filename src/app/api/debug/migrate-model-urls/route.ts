import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const admin = createAdminClient();
    const { data: products } = await admin
      .from('products')
      .select('id, model_url, product_attributes(name,value)')
      .limit(1000);

    if (!products) return NextResponse.json({ updated: 0, reason: 'no products' });

    let updated = 0;
    for (const p of products as any[]) {
      if (p.model_url) continue;
      const attr = (p.product_attributes || []).find((a: any) => a.name === 'model_url' && a.value);
      if (attr && attr.value) {
        const { error } = await admin.from('products').update({ model_url: attr.value }).eq('id', p.id);
        if (!error) updated++;
      }
    }

    return NextResponse.json({ updated });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
