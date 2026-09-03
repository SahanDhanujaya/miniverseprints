'use client';

import { X, Box } from 'lucide-react';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the web component wrapper to ensure it only loads on the client
const ModelViewerClient = dynamic(() => import('./ModelViewerClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">Loading 3D Engine</span>
    </div>
  ),
});

interface ModelViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string; // The URL to the .glb or .gltf file
  title: string;
}

export default function ModelViewerModal({ isOpen, onClose, modelUrl, title }: ModelViewerModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-3xl p-4 sm:p-8 animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/40 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Box className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{title}</h3>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Interactive 3D Viewer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Area */}
        <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-gradient-to-b from-[#111] to-[#000]">
          <ModelViewerClient modelUrl={modelUrl} alt={title} />
          
          {/* Overlay hints */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/5 text-[10px] uppercase tracking-widest text-zinc-400">
              Drag to orbit • Scroll to zoom
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
