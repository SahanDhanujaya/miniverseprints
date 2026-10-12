import { createClient } from '@/lib/supabase/server';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata = { title: 'Gallery', description: 'Printing process and final output gallery' };

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from('gallery_items').select('*').eq('is_active', true).order('sort_order').order('created_at', { ascending: false });

  return (
    <main className="max-w-7xl mx-auto px-4 pb-16">
      <Breadcrumb items={[{ label: 'Gallery' }]} />
      <div className="mb-8"><p className="text-xs uppercase tracking-[0.3em] text-foreground-muted">Studio Journal</p><h1 className="text-4xl font-bold mt-2">Printing Process & Final Outputs</h1><p className="text-foreground-muted mt-3 max-w-2xl">See how our pieces are made and explore completed MiniVersePrints work.</p></div>
      {!items?.length ? <div className="rounded-2xl border border-border bg-background-card py-20 text-center text-foreground-muted">Gallery items coming soon.</div> : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-gap:1rem]">
          {items.map((item) => (
            <article key={item.id} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl bg-background-card border border-white/10">
              {item.media_type === 'video' ? (
                <video src={item.media_url} controls muted playsInline className="block w-full bg-black object-cover" />
              ) : (
                <img src={item.media_url} alt={item.title} className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">{item.category === 'printing_process' ? 'Printing Process' : 'Final Output'}</p>
                <h2 className="mt-1 font-bold text-white">{item.title}</h2>
                {item.description && <p className="mt-1 text-sm text-zinc-300">{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
