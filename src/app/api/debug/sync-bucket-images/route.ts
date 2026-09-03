import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// Scan the Supabase storage bucket and update product_images.url to use the
// public URL for any objects whose basename matches an existing product_images.url
export async function POST() {
  try {
    const admin = createAdminClient();
    const bucket = 'miniverse_bucket';

    // list up to 2000 objects (adjust if you have more)
    const { data: objects, error: listError } = await admin.storage.from(bucket).list('', { limit: 2000 });
    if (listError) return NextResponse.json({ error: String(listError) }, { status: 500 });
    if (!objects || objects.length === 0) return NextResponse.json({ updated: 0, reason: 'no objects' });

    let updated = 0;
    for (const obj of objects) {
      const publicUrl = admin.storage.from(bucket).getPublicUrl(obj.name).data.publicUrl;
      if (!publicUrl) continue;

      const parts = obj.name.split('/');
      const basename = parts[parts.length - 1];
      if (!basename) continue;

      // find product_images rows that reference this basename in their url
      const { data: matches } = await admin
        .from('products')
        .select('id, image_url, model_url')
        .ilike('url', `%${basename}`)
        .limit(100);

      if (!matches || matches.length === 0) continue;

      for (const m of matches as any[]) {
        // only update when the existing url isn't already a Supabase public URL
        if (m.url && m.url.includes('/storage/v1/object/public/')) continue;

        const { error: upErr } = await admin.from('products').update({ url: publicUrl }).eq('id', m.id);
        if (!upErr) {
          updated++;
          // if this image is the main image for the product, also set products.image_url
          if (m.is_main && m.product_id) {
            await admin.from('products').update({ image_url: publicUrl }).eq('id', m.product_id);
          }
        }
      }
    }

    return NextResponse.json({ updated });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
