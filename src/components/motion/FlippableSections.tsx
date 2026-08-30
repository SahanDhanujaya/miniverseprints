'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface FlippableSectionsProps {
  galleryContent: React.ReactNode;
  craftsmanshipContent: React.ReactNode;
}

export default function FlippableSections({
  galleryContent,
  craftsmanshipContent,
}: FlippableSectionsProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      {/* Swap Controls */}
      <div className="flex justify-center mb-8 z-30 relative">
        <button
          onClick={() => setIsFlipped((prev) => !prev)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.1)]"
        >
          <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isFlipped ? 'rotate-180' : ''}`} />
          Swap Sections ({isFlipped ? 'Craftsmanship Top' : 'Gallery Top'})
        </button>
      </div>

      {/* 3D Container Stack */}
      <div className="flex flex-col gap-12 [perspective:1600px]">
        {/* Upper Slot */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <motion.div
            animate={{ opacity: isFlipped ? 0 : 1, pointerEvents: isFlipped ? 'none' : 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {galleryContent}
          </motion.div>

          <motion.div
            animate={{ opacity: isFlipped ? 1 : 0, pointerEvents: isFlipped ? 'auto' : 'none' }}
            transition={{ duration: 0.3 }}
            style={{ transform: 'rotateY(180deg)' }}
            className="absolute inset-0 w-full h-full"
          >
            {craftsmanshipContent}
          </motion.div>
        </motion.div>

        {/* Lower Slot */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <motion.div
            animate={{ opacity: isFlipped ? 0 : 1, pointerEvents: isFlipped ? 'none' : 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {craftsmanshipContent}
          </motion.div>

          <motion.div
            animate={{ opacity: isFlipped ? 1 : 0, pointerEvents: isFlipped ? 'auto' : 'none' }}
            transition={{ duration: 0.3 }}
            style={{ transform: 'rotateY(180deg)' }}
            className="absolute inset-0 w-full h-full"
          >
            {galleryContent}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}