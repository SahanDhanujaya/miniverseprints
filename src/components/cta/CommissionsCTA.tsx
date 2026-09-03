'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send } from 'lucide-react';
import Magnetic from '@/components/motion/Magnetic';
import { WHATSAPP_LINK } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export default function CommissionsCTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position across the section viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  // Right-to-left slide animation (100% off-screen right -> 0% center position)
  const x = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [0, 1]);

  const navigation = useRouter();

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden">
      <motion.div style={{ x, opacity }} className="w-full">
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-8 md:p-12 text-center backdrop-blur-md shadow-2xl">
            {/* Header Content */}
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-2">
              Ready to Create?
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Start Your Project
            </h2>

            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
              Whether you're a collector, designer, or artist, we have the tools and expertise to bring your ideas to life. Share reference photos or your own 3D files (<code className="text-zinc-300">.STL</code>, <code className="text-zinc-300">.OBJ</code>).
            </p>

            {/* CTA Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic>
                
                  <button onClick={() => navigation.push('/contact')} className="flex items-center gap-2 h-12 px-8 rounded-full bg-white text-black text-[15px] font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer">
                    <Send className="w-4 h-4" /> Contact Us
                  </button>
                
              </Magnetic>

              <Magnetic>
                <Link href="/collection">
                  <button className="flex items-center gap-2 h-12 px-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-[15px] font-medium hover:bg-white/10 transition-colors cursor-pointer">
                    View the Full Collection
                  </button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}