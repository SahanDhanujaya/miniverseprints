'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollSlideBottomToTop from './ScrollSlideBottomToTop';

interface ScrollFlipSectionProps {
    galleryContent: React.ReactNode;
    craftsmanshipContent: React.ReactNode;
}

export default function ScrollFlipSection({
    galleryContent,
    craftsmanshipContent,
}: ScrollFlipSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Map 3D flip rotation across scroll progress
    const rotateY = useTransform(scrollYProgress, [0.15, 0.85], [0, 180]);

    // Keep full opacity until mid-flip (90deg), then switch opacity cleanly to avoid low opacity state
    const frontOpacity = useTransform(scrollYProgress, [0.48, 0.5], [1, 0]);
    const backOpacity = useTransform(scrollYProgress, [0.5, 0.52], [0, 1]);

    return (
    <>
      {/* ─── MOBILE & TABLET LAYOUT (< 1024px) ─────────────────────────── */}
      {/* Renders sequentially in normal document flow to prevent clipping */}
      <div className="block lg:hidden w-full px-4 space-y-12 py-12">
        <div className="w-full">{galleryContent}</div>
        <ScrollSlideBottomToTop>
        <div className="w-full">{craftsmanshipContent}</div>
        </ScrollSlideBottomToTop>
      </div>

      {/* ─── DESKTOP 3D FLIP LAYOUT (≥ 1024px) ─────────────────────────── */}
      <div ref={containerRef} className="hidden lg:block relative h-[220vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center [perspective:1800px] z-10 overflow-hidden">
          <motion.div
            style={{ rotateY }}
            className="relative w-full max-w-7xl px-4 [transform-style:preserve-3d]"
          >
            {/* FRONT FACE: Gallery */}
            <motion.div
              style={{
                opacity: frontOpacity,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="w-full"
            >
              {galleryContent}
            </motion.div>

            {/* BACK FACE: Craftsmanship */}
            <motion.div
              style={{
                opacity: 1,
                rotateY: 180,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {craftsmanshipContent}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );

}