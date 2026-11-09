import { createClient } from '@/lib/supabase/server';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="group relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 shadow-lg"
            >
              {item.media_type === 'video' ? (
                <video
                  src={item.media_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/95 via-black/80 to-transparent p-5 pt-20 transition-transform duration-300 group-hover:translate-y-0 z-10 flex flex-col justify-end">
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-300">
                  {item.category === 'printing_process' ? 'Printing Process' : 'Final Output'}
                </p>
                <h2 className="mt-1 font-bold text-white text-base leading-snug">{item.title}</h2>
                {item.description && (
                  <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
