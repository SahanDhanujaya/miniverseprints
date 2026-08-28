'use client';

import Image from 'next/image';
import { MessageCircle, ZoomIn, Sparkles, ArrowRight } from 'lucide-react';
import type { GalleryItem } from '@/types';

type GalleryCardProps = {
  item: GalleryItem;
  onOpen?: (item: GalleryItem) => void;
};

export default function GalleryCard({ item, onOpen }: GalleryCardProps) {
  const whatsappMessage = `Hi MiniVersePrints! I saw "${item.title}" in your gallery (${item.category}). Could you let me know about availability, pricing, and custom options?`;
  const whatsappUrl = `https://wa.me/94782525156?text=${encodeURIComponent(whatsappMessage)}`;

  const handleClick = () => {
    if (onOpen) {
      onOpen(item);
    } else {
      window.location.href = '/gallery';
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-[#FAF6F0] rounded-2xl border border-[#D5C5B5] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Framed Polaroid Photograph Container */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-[#E8DCCF] border border-[#D5C5B5] mb-4">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill on Image */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF6F0]/95 backdrop-blur-md text-[#1F150E] border border-[#D5C5B5] shadow-2xs">
            {item.category}
          </span>
        </div>

        {item.is_featured && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A34E17] text-white shadow-2xs">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          </div>
        )}

        {/* Hover zoom overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] text-[#1F150E] font-semibold text-xs flex items-center gap-1.5 shadow-lg">
            <ZoomIn className="w-3.5 h-3.5 text-[#A34E17]" /> View Details
          </span>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif text-base md:text-lg font-bold text-[#1F150E] group-hover:text-[#A34E17] transition-colors line-clamp-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-[#6E5A4B] line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Action Link & WhatsApp CTA */}
        <div className="pt-3 border-t border-[#E2D6C8] flex items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#A34E17] group-hover:underline flex items-center gap-1">
            Details <ArrowRight className="w-3 h-3" />
          </span>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-green-100 hover:bg-[#16A34A] text-green-800 hover:text-white border border-green-300 text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Inquire
          </a>
        </div>
      </div>
    </article>
  );
}
