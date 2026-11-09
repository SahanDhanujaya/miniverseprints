import { createClient } from '@/lib/supabase/server';
import GalleryGrid from './GalleryGrid';

export const metadata = { title: 'Gallery', description: 'Printing process and final output gallery' };

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Printing Process & Final Outputs
        </h1>
        <p className="text-foreground-muted mt-2 text-sm md:text-base">
          See how our pieces are made and explore completed MiniVersePrints work.
        </p>
      </div>

      {!items?.length ? (
        <div className="rounded-2xl border border-border bg-background-card py-20 text-center text-foreground-muted">
          Gallery items coming soon.
        </div>
      ) : (
        <GalleryGrid items={items} />
      )}
    </div>
  );
}
