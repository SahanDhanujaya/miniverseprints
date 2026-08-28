'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles, X, Filter } from 'lucide-react';
import GalleryCard from './GalleryCard';
import GalleryLightbox from './GalleryLightbox';
import Button from '@/components/ui/Button';
import { GALLERY_CATEGORIES } from '@/lib/demo-gallery';
import type { GalleryItem } from '@/types';

type GalleryViewProps = {
  initialItems: GalleryItem[];
};

export default function GalleryView({ initialItems }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter items based on active category & search query
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [initialItems, selectedCategory, searchQuery]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialItems.length };
    GALLERY_CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = initialItems.filter(
          (item) => item.category.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [initialItems]);

  return (
    <div className="space-y-8">
      {/* Category Picker & Search Control Toolbar */}
      <div className="bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-4 sm:p-6 shadow-sm space-y-5">
        {/* Category Pills Header */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {GALLERY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] ?? 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`group px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F150E] text-white shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-[#F5ECE1] text-[#6E5A4B] hover:text-[#1F150E] border border-[#D5C5B5]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EFE7DC] text-[#6E5A4B] group-hover:bg-[#E2D4C3]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Result Statistics */}
        <div className="pt-4 border-t border-[#E2D6C8] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7969]" />
            <input
              type="text"
              placeholder="Search figure, anime, superhero, material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#D5C5B5] text-[#1F150E] text-sm placeholder:text-[#8C7969] focus:outline-none focus:ring-2 focus:ring-[#A34E17]/30 focus:border-[#A34E17] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8C7969] hover:text-[#1F150E]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results Count & Filter Tag */}
          <div className="text-xs text-[#6E5A4B] flex flex-wrap items-center gap-2 self-start sm:self-auto font-medium">
            <span>
              Showing <strong className="text-[#1F150E] font-bold">{filteredItems.length}</strong> works
            </span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFE7DC] hover:bg-[#E2D4C3] border border-[#D5C5B5] text-[#A34E17] font-bold text-xs transition-colors"
                title="Reset to All"
              >
                <span>{selectedCategory}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onOpen={(clickedItem) => setSelectedItem(clickedItem)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#F5E3D3] flex items-center justify-center text-[#A34E17] mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1F150E]">No gallery works found</h3>
          <p className="text-[#6E5A4B] text-sm max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find any items matching &quot;{searchQuery}&quot; in {selectedCategory}. Try resetting your search or request a custom 3D print.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="border-[#D5C5B5] text-[#1F150E]"
            >
              Reset Filters
            </Button>
            <a href="/custom-order">
              <Button className="bg-[#A34E17] hover:bg-[#853D10] text-white">
                <Sparkles className="w-4 h-4 mr-2" /> Request Custom Print
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <GalleryLightbox
        item={selectedItem}
        items={filteredItems}
        onClose={() => setSelectedItem(null)}
        onSelect={(item) => setSelectedItem(item)}
      />
    </div>
  );
}
