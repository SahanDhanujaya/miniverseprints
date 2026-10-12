import { createClient } from '@/lib/supabase/server';
import GalleryManager from './GalleryManager';

export const metadata = { title: 'Gallery - Admin' };

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from('gallery_items').select('*').order('sort_order').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gallery</h1>
      {error?.code === 'PGRST205' || error?.message?.includes('gallery_items') ? (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Gallery database table is not installed. Apply <code>supabase/migrations/006_gallery_items.sql</code> in the linked Supabase project, then refresh this page.
        </div>
      ) : null}
      <GalleryManager items={items || []} />
    </div>
  );
}
