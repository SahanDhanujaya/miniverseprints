'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

const TOTAL_FRAMES = 30;

// ─── Glass letter CSS clipped to each text element ───────────────────────────
const glassStyle = (brightness = 1): React.CSSProperties => ({
  background: `linear-gradient(
    135deg,
    rgba(255,255,255,${0.55 * brightness}) 0%,
    rgba(255,255,255,${0.95 * brightness}) 25%,
    rgba(210,210,225,${0.48 * brightness}) 52%,
    rgba(255,255,255,${0.92 * brightness}) 76%,
    rgba(200,200,220,${0.50 * brightness}) 100%
  )`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  WebkitTextStroke: `1px rgba(255,255,255,${0.14 * brightness})`,
  filter: `drop-shadow(0 0 ${32 * brightness}px rgba(255,255,255,${0.28 * brightness})) drop-shadow(0 2px 8px rgba(0,0,0,0.85))`,
  userSelect: 'none',
});

export default function HeroSequence() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cachedImagesRef = useRef<HTMLImageElement[]>([]);

  // 1. Framer Motion Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 2. Add Spring Physics to smooth out raw wheel/trackpad scroll inputs
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3. Map smooth progress directly to frame index (1 -> 30)
  const frameTransform = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Preload all 30 image frames into browser cache
  useEffect(() => {
    let isMounted = true;
    const loadFrames = async () => {
      const eager = Array.from({ length: 5 }, (_, i) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = `/anime_frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`;
        })
      );
      await Promise.all(eager);
      if (isMounted) setIsLoaded(true);

      for (let i = 6; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/anime_frames/ezgif-frame-${String(i).padStart(3, '0')}.png`;
        cachedImagesRef.current.push(img);
      }
    };
    loadFrames();
    return () => { isMounted = false; };
  }, []);

  // Sync current frame state with spring-smoothed transform value
  useEffect(() => {
    const unsubscribe = frameTransform.on('change', (latest) => {
      const targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(latest)));
      setCurrentFrame(targetFrame);
    });
    return () => unsubscribe();
  }, [frameTransform]);

  const src = `/anime_frames/ezgif-frame-${String(currentFrame).padStart(3, '0')}.png`;

  return (
    /* Expanded container to 600vh for ultra-smooth scroll pacing */
    <div ref={containerRef} className="relative h-[600vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Car frame canvas ──────────────────────────────────── */}
        <div className="absolute inset-0 bg-black">
          {!isLoaded ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-zinc-700 border-t-white animate-spin" />
              <span className="text-[11px] text-zinc-500 tracking-[0.3em] uppercase">Loading sequence…</span>
            </div>
          ) : (
            <img
              key={src}
              src={src}
              alt="Rotating 3D-printed car"
              className="w-full h-full object-cover"
              decoding="async"
            />
          )}
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/40 pointer-events-none" />
          {/* Soft left darkening so text is legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* ── Reference-style layout: bottom-left anchored ─────── */}
        {isLoaded && (
          <div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 z-10 pointer-events-none select-none max-w-4xl">

            {/* ── Title — two-line hierarchy ─── */}
            <div className="mb-6">
              <div
                className="block font-bold leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
                  ...glassStyle(0.8),
                }}
              >
                Print Your Ideas
              </div>

              <div
                className="block font-black leading-none tracking-tighter"
                style={{
                  fontSize: 'clamp(3.2rem, 8.5vw, 8rem)',
                  ...glassStyle(1.15),
                  filter: `drop-shadow(0 0 55px rgba(255,255,255,0.45)) drop-shadow(0 4px 14px rgba(0,0,0,0.9))`,
                }}
              >
                To 3D Sketches
              </div>
            </div>

            {/* ── Description + CTA row ────────────────────────── */}
            <div className="flex items-end justify-between gap-8 flex-wrap pointer-events-auto">
              <p className="text-[11px] md:text-[12px] leading-[1.9] tracking-[0.18em] uppercase text-zinc-400 max-w-xs">
                We transform your concepts into premium&nbsp;3D-printed miniatures&nbsp;&amp; collectibles — museum-grade detail, hand-painted finish.
              </p>

              <Link href="#gallery" className="flex items-center gap-4 group flex-shrink-0">
                <span className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 group-hover:text-white transition-colors">
                  Gallery
                </span>
                <div className="w-12 h-12 rounded-full border border-white/25 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-white/15 group-hover:border-white/50 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white translate-x-px">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}