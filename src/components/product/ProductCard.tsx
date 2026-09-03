'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Box } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Product } from '@/types';
import { getProductEnquiryLink, truncate } from '@/lib/utils';
import ModelViewerModal from '@/components/3d/ModelViewerModal';
import { resolveProductModelUrl } from '@/lib/product-preview';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productImages = product.images?.length ? product.images : product.product_images || [];
  const fallbackMainImage = product.image_url ? { id: 'fallback-image', product_id: product.id, url: product.image_url, alt_text: product.name, sort_order: 0, is_main: true, created_at: new Date().toISOString() } : null;
  const mainImage = productImages.find((img) => img.is_main) || productImages[0] || fallbackMainImage;
  const modelUrl = resolveProductModelUrl(product);
  const hasModel = Boolean(modelUrl);

  return (
    <>
      <div 
        onClick={() => hasModel && setIsModalOpen(true)}
        className={`product-card group relative bg-black/20 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/15 hover:shadow-[0_8px_40px_rgba(255,255,255,0.05)] ${hasModel ? 'cursor-pointer ring-1 ring-transparent hover:ring-white/10' : 'cursor-default'}`}
      >
        <div className="block relative aspect-[3/4] overflow-hidden bg-black/40">
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.05),transparent_32%),linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.03)_48%,transparent_66%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-shimmer" />
          
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt_text || product.name}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-zinc-600 text-sm">No Image</span>
            </div>
          )}
          
          {/* 3D Action Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px] z-20">
            {hasModel ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-black/70 text-white font-medium text-[13px] backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Box className="w-4 h-4" />
                View in 3D
              </div>
            ) : (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-black/70 text-zinc-300 font-medium text-[13px] backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Box className="w-4 h-4" />
                No Preview
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-30">
            {product.is_new_arrival && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-white text-black">New</span>
            )}
            {product.is_best_seller && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">Best Seller</span>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-medium text-white mb-1.5 line-clamp-1">{product.name}</h3>
          
          {product.short_description && (
            <p className="text-[13px] text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
              {truncate(product.short_description, 80)}
            </p>
          )}

          {/* Actions (Only Commission) */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(getProductEnquiryLink(product.name, `${process.env.NEXT_PUBLIC_SITE_URL}/model/${product.slug}`), '_blank');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire Custom Build
            </button>
          </div>
        </div>
      </div>

      {hasModel && (
        <ModelViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modelUrl={modelUrl as string}
          title={product.name}
        />
      )}
    </>
  );
}
