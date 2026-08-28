'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, MessageCircle, ChevronLeft, ChevronRight, Sparkles, Layers, Ruler } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { GalleryItem } from '@/types';

type GalleryLightboxProps = {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
};

export default function GalleryLightbox({
  item,
  items,
  onClose,
  onSelect,
}: GalleryLightboxProps) {
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else {
      onSelect(items[items.length - 1]);
    }
  }, [currentIndex, items, onSelect]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else {
      onSelect(items[0]);
    }
  }, [currentIndex, items, onSelect]);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, handlePrev, handleNext, onClose]);

  if (!item) return null;

  const whatsappMessage = `Hi MiniVersePrints! I saw "${item.title}" in your gallery (${item.category}). Could you provide more details, pricing, and how I can order one?`;
  const whatsappUrl = `https://wa.me/94782525156?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-3 md:left-6 z-20 p-3 rounded-full bg-[#FAF6F0] hover:bg-white text-[#1F150E] border border-[#D5C5B5] shadow-lg transition-transform active:scale-90"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-3 md:right-6 z-20 p-3 rounded-full bg-[#FAF6F0] hover:bg-white text-[#1F150E] border border-[#D5C5B5] shadow-lg transition-transform active:scale-90"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Lightbox Container */}
      <div
        className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#FAF6F0] hover:bg-white text-[#1F150E] border border-[#D5C5B5] shadow-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview Container */}
        <div className="relative w-full lg:w-3/5 bg-[#E8DCCF] flex items-center justify-center min-h-[300px] md:min-h-[480px] p-6 border-b lg:border-b-0 lg:border-r border-[#D5C5B5]">
          <div className="relative w-full h-[300px] md:h-[480px]">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Info Column */}
        <div className="w-full lg:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-none bg-[#FAF6F0]">
          <div className="space-y-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#F5E3D3] text-[#A34E17] border border-[#E4CEBC] mb-2 uppercase tracking-wider">
                {item.category}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F150E] leading-snug">
                {item.title}
              </h2>
            </div>

            {item.description && (
              <p className="text-[#6E5A4B] text-sm leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Specs */}
            <div className="space-y-2.5 pt-3 border-t border-[#D5C5B5] text-xs text-[#6E5A4B]">
              {item.dimensions && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#A34E17]" />
                  <span><strong className="text-[#1F150E]">Dimensions:</strong> {item.dimensions}</span>
                </div>
              )}
              {item.material && (
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#A34E17]" />
                  <span><strong className="text-[#1F150E]">Material & Finish:</strong> {item.material}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg bg-[#EFE7DC] border border-[#D5C5B5] text-[11px] font-semibold text-[#6E5A4B]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 mt-6 border-t border-[#D5C5B5] space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold shadow-md flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /> Inquire on WhatsApp
              </Button>
            </a>

            <Link href="/custom-order" onClick={onClose} className="block">
              <Button variant="outline" size="lg" className="w-full border-[#D5C5B5] text-[#1F150E] hover:bg-[#EFE7DC] flex items-center justify-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-[#A34E17]" /> Request Custom Variation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
