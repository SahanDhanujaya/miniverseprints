'use client';

import { useState, useRef } from 'react';
import { Play } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  category: 'printing_process' | 'final_output';
  sort_order: number;
  is_active: boolean;
}

function VideoCard({ item }: { item: GalleryItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article
      onClick={handleToggle}
      className="group relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 shadow-lg cursor-pointer select-none"
    >
      <video
        ref={videoRef}
        src={item.media_url}
        loop
        muted
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover bg-black"
      />

      {/* Centered Play Button when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-transform duration-300 group-hover:scale-110">
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
            <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Info Overlay */}
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
  );
}

function ImageCard({ item }: { item: GalleryItem }) {
  return (
    <article className="group relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 shadow-lg select-none">
      <img
        src={item.media_url}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
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
  );
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {items.map((item) =>
        item.media_type === 'video' ? (
          <VideoCard key={item.id} item={item} />
        ) : (
          <ImageCard key={item.id} item={item} />
        )
      )}
    </div>
  );
}
