'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Box } from 'lucide-react';
import { Product } from '@/types';
import { getProductEnquiryLink } from '@/lib/utils';
import ModelViewerModal from '@/components/3d/ModelViewerModal';
import { resolveProductModelUrl } from '@/lib/product-preview';

interface ProductCarouselProps {
  products: Product[];
}

const CARD_W = 280;   // px width of each card
const GAP = 20;       // px gap between cards
const STEP = CARD_W + GAP;
const BASE_SPEED = 0.6; // px per frame at 60fps

function CarouselCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const productImages = product.images?.length ? product.images : product.product_images || [];
  const fallbackMainImage = product.image_url ? { id: 'fallback-image', product_id: product.id, url: product.image_url, alt_text: product.name, sort_order: 0, is_main: true, created_at: new Date().toISOString() } : null;
  const mainImage = productImages.find((img) => img.is_main) || productImages[0] || fallbackMainImage;
  const modelUrl = resolveProductModelUrl(product);
  const hasModel = Boolean(modelUrl);

  return (
    <>
      <div
        onClick={() => hasModel && setIsModalOpen(true)}
        style={{ width: CARD_W, flexShrink: 0 }}
        className={`group relative bg-black/20 rounded-2xl border border-white/5 overflow-hidden
                   transition-all duration-300 hover:border-white/20
                   hover:shadow-[0_8px_40px_rgba(255,255,255,0.07)] ${hasModel ? 'cursor-pointer ring-1 ring-transparent hover:ring-white/10' : 'cursor-default'}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
          {/* Shimmer overlay */}
          <div className="pointer-events-none absolute inset-0 z-10
            bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.05),transparent_32%),
                linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.03)_48%,transparent_66%)]
            opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt_text || product.name}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="280px"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-zinc-600 text-sm">No Image</span>
            </div>
          )}

          {/* 3D hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px] z-20">
            {hasModel ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20
                bg-black/70 text-white font-medium text-[12px] backdrop-blur-xl
                shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Box className="w-3.5 h-3.5" /> View in 3D
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20
                bg-black/70 text-zinc-300 font-medium text-[12px] backdrop-blur-xl
                shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Box className="w-3.5 h-3.5" /> No Preview
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-30">
            {product.is_new_arrival && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-white text-black">
                New
              </span>
            )}
            {product.is_best_seller && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Card footer — name + enquire, NO price */}
        <div className="p-4">
          <h3 className="font-medium text-white text-sm line-clamp-1 mb-3">{product.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                getProductEnquiryLink(
                  product.name,
                  `${process.env.NEXT_PUBLIC_SITE_URL}/model/${product.slug}`,
                ),
                '_blank',
              );
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-medium
              rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Enquire
          </button>
        </div>
      </div>

      {hasModel && (
        <ModelViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modelUrl={modelUrl as string}
          title={product.name}
        />
      )}
    </>
  );
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  // Duplicate list enough times to fill wide screens and loop seamlessly
  const repeated = [...products, ...products, ...products];
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Total width of one full copy of the list
  const singleWidth = products.length * STEP;

  useEffect(() => {
    const tick = (time: number) => {
      if (!isDragging.current && !isHovered.current) {
        const delta = lastTimeRef.current != null ? time - lastTimeRef.current : 0;
        const speed = BASE_SPEED * (delta / (1000 / 60)); // normalise to 60fps
        let next = x.get() - speed;
        // Reset when we've scrolled one full copy width
        if (Math.abs(next) >= singleWidth) next += singleWidth;
        x.set(next);
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [singleWidth, x]);

  const handleDragEnd = () => {
    isDragging.current = false;
    // Clamp x back into the valid looping range after drag
    let curr = x.get();
    while (curr > 0) curr -= singleWidth;
    while (curr < -singleWidth * 2) curr += singleWidth;
    x.set(curr);
  };

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10
        bg-gradient-to-r from-black/80 via-black/10 to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10
        bg-gradient-to-l from-black/80 via-black/10 to-transparent" />

      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -singleWidth * 2, right: 0 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
      >
        {repeated.map((product, i) => (
          <div key={`${product.id}-${i}`} style={{ marginRight: GAP }}>
            <CarouselCard product={product} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
