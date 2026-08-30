'use client';

import { useEffect } from 'react';
import '@google/model-viewer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ModelViewerClientProps {
  modelUrl: string;
  alt: string;
}

export default function ModelViewerClient({ modelUrl, alt }: ModelViewerClientProps) {
  // Web component requires client-side rendering
  return (
    // @ts-ignore: Custom web component
    <model-viewer
      src={modelUrl}
      alt={alt}
      auto-rotate
      camera-controls
      ar
      shadow-intensity="1"
      exposure="1.2"
      environment-image="neutral"
      style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
    />
  );
}
