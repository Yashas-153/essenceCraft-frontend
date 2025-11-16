import React from 'react';
import ProductCard from '@/components/common-components/ProductCard';
import { Loader2 } from 'lucide-react';

const ProductsGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-stone-600">Loading products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-stone-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-stone-900 mb-2">
            No products found
          </h3>
          <p className="text-stone-600">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Results count */}
      <div className="mb-6">
        <p className="text-stone-600">
          Showing <span className="font-semibold text-stone-900">{products.length}</span> products
        </p>
      </div>

      {/* Products grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default ProductsGrid;