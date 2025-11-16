import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/common-components/ProductCard';
import { Loader2 } from 'lucide-react';

const RelatedProducts = ({ currentProductId }) => {
  const { products, loading } = useProducts({ limit: 4 });

  // Filter out current product
  const relatedProducts = products.filter(p => p.id !== currentProductId).slice(0, 4);

  if (loading) {
    return (
      <div className="mt-16 py-12 text-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-16 border-t-2 border-stone-200">
      <div className="mb-8">
        <div className="inline-block mb-4">
          <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">
            You May Also Like
          </span>
          <div className="w-12 h-0.5 bg-emerald-600 mt-2"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-light text-stone-900">
          Related <span className="font-semibold">Products</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;