'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('recently_viewed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('recently_viewed');
        setItems(stored ? JSON.parse(stored) : []);
      } catch {
        setItems([]);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.slice(0, 8).map(item => (
          <Link key={item.id} href={`/product/${item.slug}`} className="flex-shrink-0 w-32 group">
            <div className="aspect-square rounded-xl bg-background-hover overflow-hidden mb-2">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground-muted text-xs">No Image</div>
              )}
            </div>
            <p className="text-xs font-medium line-clamp-2 group-hover:text-accent transition-colors">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function useRecentlyViewed() {
  if (typeof window === 'undefined') return;

  const add = (item: RecentlyViewedItem) => {
    try {
      const stored = localStorage.getItem('recently_viewed');
      const existing: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter(i => i.id !== item.id);
      const updated = [item, ...filtered].slice(0, 20);
      localStorage.setItem('recently_viewed', JSON.stringify(updated));
    } catch {}
  };

  return { add };
}
