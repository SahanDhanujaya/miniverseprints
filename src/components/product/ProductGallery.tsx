'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: { url: string; alt_text?: string | null; is_main?: boolean | null; sort_order?: number | null }[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  const mainImage = sorted.find(i => i.is_main) || sorted[0];
  const [selected, setSelected] = useState(mainImage || null);
  const [zoomed, setZoomed] = useState(false);

  if (!images.length) {
    return <div className="aspect-[3/4] bg-background-hover rounded-2xl flex items-center justify-center text-foreground-muted">No images</div>;
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-[3/4] bg-background-hover rounded-2xl overflow-hidden cursor-zoom-in group"
        onClick={() => setZoomed(!zoomed)}
      >
        {selected && (
          <Image
            src={selected.url}
            alt={selected.alt_text || 'Product image'}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute top-3 right-3 p-2 bg-background/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-5 h-5" />
        </div>
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(img)}
              className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                selected?.url === img.url ? 'border-accent' : 'border-border hover:border-foreground-muted'
              }`}
            >
              <Image src={img.url} alt={img.alt_text || `View ${i + 1}`} width={64} height={64} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom overlay */}
      {zoomed && selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoomed(false)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image src={selected.url} alt={selected.alt_text || 'Product image'} fill className="object-contain" sizes="90vw" />
          </div>
          <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30">✕</button>
        </div>
      )}
    </div>
  );
}
