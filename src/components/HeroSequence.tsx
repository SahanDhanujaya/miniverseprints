'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

const TOTAL_FRAMES = 30;

// ─── Glass typography styling ─────────────────────────────────────────
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Framer Motion Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 2. Add inertia spring physics for smooth trackpad scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // 3. Map scroll position to frame range
  const frameTransform = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

  // 4. Safe image loader preventing infinite load loops
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const handleSingleLoad = () => {
      loadedCount++;
      // Unlock sequence once at least the first 3 frames are guaranteed ready
      if (loadedCount >= 3 && !isLoaded) {
        setIsLoaded(true);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      // Supports .webp or fallback .png files placed in /public/anime_frames/
      img.src = `/anime_frames/ezgif-frame-${String(i).padStart(3, '0')}.webp`;
      img.onload = handleSingleLoad;
      img.onerror = () => {
        // Fallback to PNG if WebP fails
        img.src = `/anime_frames/ezgif-frame-${String(i).padStart(3, '0')}.png`;
        handleSingleLoad();
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  // 5. Draw targeted frame to Canvas GPU surface
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[index - 1];

    // Check complete state AND verify naturalWidth is non-zero (non-broken)
    if (ctx && img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  // 6. Connect scroll physics tick to Canvas render pipeline
  useEffect(() => {
    if (!isLoaded) return;

    // Draw initial frame on mount
    renderFrame(1);

    const unsubscribe = frameTransform.on('change', (latest) => {
      const targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(latest)));
      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        requestAnimationFrame(() => renderFrame(targetFrame));
      }
    });

    return () => unsubscribe();
  }, [isLoaded, frameTransform]);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        
        {/* Canvas Engine — 60 FPS GPU Render Target */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />

        {/* Loading Spinner Fallback */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-4 z-20">
            <div className="w-10 h-10 rounded-full border-4 border-zinc-700 border-t-white animate-spin" />
            <span className="text-[11px] text-zinc-500 tracking-[0.3em] uppercase">
              Preparing Atelier Hardware…
            </span>
          </div>
        )}

        {/* Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Hero Section Content Overlay */}
        {isLoaded && (
          <div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 z-10 pointer-events-none select-none max-w-4xl">
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

            <div className="flex items-end justify-between gap-8 flex-wrap pointer-events-auto">
              <p className="text-[11px] md:text-[12px] leading-[1.9] tracking-[0.18em] uppercase text-zinc-400 max-w-xs">
                We transform your concepts into premium 3D-printed miniatures & collectibles — museum-grade detail, hand-painted finish.
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