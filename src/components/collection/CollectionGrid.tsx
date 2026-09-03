'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Search, Filter } from 'lucide-react';
import { Product, Category } from '@/types';
import { getProductEnquiryLink } from '@/lib/utils';
import ModelViewerModal from '@/components/3d/ModelViewerModal';

interface CollectionGridProps {
  products: Product[];
  categories: Category[];
}

export default function CollectionGrid({ products, categories }: CollectionGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 3D Model Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModelUrl, setActiveModelUrl] = useState<string>('');
  const [activeModelTitle, setActiveModelTitle] = useState<string>('');

  // Filter products by search query and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      product.categories?.find((category) => category.slug === selectedCategory) ||
      (product as any).category?.slug === selectedCategory;

    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleOpen3D = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const modelUrl = (product as any).model_url || '/models/default_model.glb';
    setActiveModelUrl(modelUrl);
    setActiveModelTitle(product.name);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-black'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            All Works ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950 border border-white/10 rounded-3xl">
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">
            No collection items found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const productImages = product.images?.length
              ? product.images
              : (product as any).product_images || [];
            const mainImage = productImages.find((img: any) => img.is_main) || productImages[0];
            const imageUrl = mainImage ? (mainImage.url || mainImage.image_url) : '/placeholder.jpg';

            return (
              <div
                key={product.id}
                className="group relative bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 flex flex-col"
              >
                {/* Artwork Thumbnail Container */}
                <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    {product.is_new_arrival && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-white text-black">
                        New
                      </span>
                    )}
                    {product.is_best_seller && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-zinc-800 text-zinc-200 border border-white/10">
                        Top Piece
                      </span>
                    )}
                  </div>

                  {/* 3D Model Modal Trigger CTA */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] z-20 p-4">
                    <button
                      onClick={(e) => handleOpen3D(e, product)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/30 bg-black/80 text-white font-medium text-xs backdrop-blur-xl shadow-lg hover:bg-white hover:text-black transition-all cursor-pointer"
                    >
                      <Box className="w-4 h-4" /> View Interactive 3D
                    </button>
                  </div>
                </div>

                {/* Footer Meta & Enquiry Button */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base font-semibold text-white line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest mb-4">
                      3D Gallery Piece
                    </p>
                  </div>

                  <a
                    href={getProductEnquiryLink(
                      product.name,
                      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/collection`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/15 hover:bg-white hover:text-black transition-colors text-center block"
                  >
                    Enquire About This Piece
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3D Model Modal */}
      <ModelViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modelUrl={activeModelUrl}
        title={activeModelTitle}
      />
    </div>
  );
}