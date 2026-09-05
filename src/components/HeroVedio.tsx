'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

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

export default function HeroVedio() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
 
  useEffect(() => {
    // Set video playback speed (0.5 = 50% speed, 0.75 = 75% speed)
    const SPEED = 0.5;

    if (desktopVideoRef.current) {
      desktopVideoRef.current.playbackRate = SPEED;
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.playbackRate = SPEED;
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Desktop Video Target */}
      <video
        ref={desktopVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
      >
        <source src="/vedios/hero-desktop.mp4" type="video/mp4" />
      </video>

      {/* Mobile Video Target */}
      <video
        ref={mobileVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="block md:hidden absolute inset-0 w-full h-full object-cover"
      >
        <source src="/vedios/hero-mobile.mp4" type="video/mp4" />
      </video>

      {/* Ambient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />

      {/* Hero Section Content Overlay */}
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white translate-x-px"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}