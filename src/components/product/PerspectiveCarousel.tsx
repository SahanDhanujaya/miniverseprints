'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Box, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { getProductEnquiryLink } from '@/lib/utils';
import ModelViewerModal from '@/components/3d/ModelViewerModal';
import { resolveProductModelUrl, hasSupabasePreview, hasSupabaseModel } from '@/lib/product-preview';

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModelUrl, setActiveModelUrl] = useState<string>('');
  const [activeModelTitle, setActiveModelTitle] = useState<string>('');
  
  const isHovered = useRef(false);

  // Show any product that has a primary image available (Supabase or local).
  // The 3D button remains gated to Supabase-hosted models via `hasSupabaseModel`.
  const hasPrimaryImage = (p: Product) => {
    const imageUrlFromField = (p as any).image_url || null;
    const productImages = (p as any).images?.length ? (p as any).images : (p as any).product_images || [];
    const mainImage = productImages.find((img: any) => img.is_main) || productImages[0] || null;
    const imageUrl = imageUrlFromField || (mainImage ? (mainImage.url || null) : null);
    return Boolean(imageUrl);
  };

  const visibleProducts = products.filter((p) => hasPrimaryImage(p));

  useEffect(() => {
    // Debug: log incoming products and how many are visible
    // (browser console)
    // eslint-disable-next-line no-console
    console.log('PerspectiveCarousel: products', products?.length, 'visible', visibleProducts.length);
  }, [products, visibleProducts.length]);

  // Auto-play the carousel every 3.5 seconds unless hovered or modal is open
  useEffect(() => {
    if (!visibleProducts.length) return;

    const interval = setInterval(() => {
      if (!isHovered.current && !isModalOpen) {
        setActiveIndex((prev) => (prev + 1) % visibleProducts.length);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [visibleProducts.length, isModalOpen]);

  if (!visibleProducts || visibleProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 text-sm">No products found in gallery.</p>
      </div>
    );
  }

  // Ensure activeIndex is reset if filtered list is shorter
  useEffect(() => {
    if (activeIndex >= visibleProducts.length) {
      setActiveIndex(0);
    }
  }, [visibleProducts.length, activeIndex]);

  const activeProduct = visibleProducts[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % visibleProducts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + visibleProducts.length) % visibleProducts.length);
  };

  const handleOpen3D = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    const modelUrl = resolveProductModelUrl(product);
    if (!modelUrl) {
      return;
    }

    setActiveModelUrl(modelUrl);
    setActiveModelTitle(product.name);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="relative w-full py-6 flex flex-col items-center justify-center overflow-hidden select-none"
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={() => {
          isHovered.current = false;
        }}
      >
        {/* Left & Right Edge Fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-r from-black via-black/30 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-l from-black via-black/30 to-transparent" />

        {/* 3D Perspective Deck Area */}
        <div className="relative w-full max-w-5xl h-[420px] md:h-[480px] flex items-center justify-center [perspective:1200px]">
          {visibleProducts.map((product, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const modelUrl = resolveProductModelUrl(product);
            const hasModel = Boolean(modelUrl);

            // Prefer explicit `image_url` field (Supabase bucket URL) across the project
            const imageUrlFromField = product.image_url || null;
            const productImages = product.images?.length ? product.images : product.product_images || [];
            const mainImage = productImages.find((img) => img.is_main) || productImages[0] || null;
            const imageUrl = imageUrlFromField || (mainImage ? (mainImage.url || null) : null) || '/placeholder.jpg';

            return (
              <motion.div
                key={`${product.id}-${index}`}
                onClick={() => setActiveIndex(index)}
                className="absolute w-60 h-80 md:w-64 md:h-96 rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer border border-white/15 bg-zinc-900 group"
                animate={{
                  x: offset * 180,
                  z: -Math.abs(offset) * 130,
                  rotateY: offset * -25,
                  scale: isActive ? 1.05 : 0.85,
                  opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25,
                }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                style={{ zIndex: 30 - Math.abs(offset) }}
              >
                {/* Image & Shimmer Overlay */}
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="280px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    draggable={false}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                  

                  {/* Interactive Hover CTA to View in 3D */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] z-20 p-4 gap-3">
                    {hasSupabaseModel(product) ? (
                      <button
                        onClick={(e) => handleOpen3D(e, product)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/30 bg-black/80 text-white font-medium text-xs backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-white hover:text-black transition-all cursor-pointer"
                      >
                        <Box className="w-4 h-4" /> View Interactive 3D
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 bg-black/70 text-zinc-300 font-medium text-xs backdrop-blur-xl">
                        <Box className="w-4 h-4" /> No Preview
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Traversal Controls */}
        <div className="flex items-center gap-6 mt-2 z-30">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono tracking-widest text-zinc-400">
            0{activeIndex + 1} / 0{visibleProducts.length}
          </span>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Next artwork"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Typography & Inquiry Action (NO PRICE) */}
        <div className="text-center mt-6 h-28 z-30 px-4 max-w-lg mx-auto flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full"
            >
              <p className="text-[11px] tracking-[0.25em] text-zinc-400 uppercase font-mono mb-1">
                PIECE (0{activeIndex + 1}) • {activeProduct?.is_featured ? 'FEATURED WORK' : 'GALLERY COLLECTION'}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white line-clamp-1 mb-3">
                {activeProduct?.name}
              </h2>

              {/* Enquiry Button */}
              {activeProduct && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      getProductEnquiryLink(
                        activeProduct.name,
                        `${process.env.NEXT_PUBLIC_SITE_URL || ''}/model/${activeProduct.slug}`,
                      ),
                      '_blank',
                    );
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-medium rounded-full bg-white/10 border border-white/15 text-zinc-200 hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Enquire About This Piece
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3D Model Modal */}
      <ModelViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modelUrl={activeModelUrl}
        title={activeModelTitle}
      />
    </>
  );
}