import ProductCard from './ProductCard';
import { Product } from '@/types';

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
