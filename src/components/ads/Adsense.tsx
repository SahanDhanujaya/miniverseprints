"use client";

import { useEffect } from 'react';

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4554856508485846';

export default function Adsense() {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;

    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    // Avoid injecting duplicate script
    if (document.querySelector(`script[src="${src}"]`)) return;

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.crossOrigin = 'anonymous';
    // Append directly to head so no data-nscript attribute is added by Next
    document.head.appendChild(s);

    return () => {
      // optional cleanup: remove script on unmount
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) existing.remove();
    };
  }, []);

  return null;
}
