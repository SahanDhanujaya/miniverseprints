'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, VIEWPORT } from '@/components/motion/variants';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const colClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 text-sm">No products found.</p>
      </div>
    );
  }

  return (
    // Stagger container: orchestrates children one by one, 0.1s apart
    <motion.div
      className={`grid ${colClasses[columns]} gap-4 md:gap-6`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {products.map((product) => (
        // Each card is a stagger item — slides up and fades in sequentially
        <motion.div
          key={product.id}
          variants={staggerItem}
          style={{ willChange: 'transform, opacity' }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
