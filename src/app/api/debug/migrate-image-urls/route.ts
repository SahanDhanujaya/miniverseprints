import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { isSupabaseStorageUrl } from '@/lib/product-preview';

export async function POST() {
  try {
    const admin = createAdminClient();

    // Fetch products with their images
    const { data: products } = await admin
      .from('products')
      .select('id, image_url, product_images(url,is_main)')
      .limit(1000);

    if (!products) return NextResponse.json({ updated: 0, reason: 'no products' });

    const updates: { id: string; image_url: string }[] = [];

    for (const p of products as any[]) {
      if (p.image_url) continue; // already set
      const images = p.product_images || [];
      // prefer main image, else first
      const main = images.find((i: any) => i.is_main) || images[0];
      const candidate = main?.url || null;
      if (candidate && isSupabaseStorageUrl(candidate)) {
        updates.push({ id: p.id, image_url: candidate });
      }
    }

    let updated = 0;
    for (const u of updates) {
      const { error } = await admin.from('products').update({ image_url: u.image_url }).eq('id', u.id);
      if (!error) updated++;
    }

    return NextResponse.json({ updated, tried: updates.length });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
