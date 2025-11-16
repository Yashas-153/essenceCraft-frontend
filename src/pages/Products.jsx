import React from 'react';
import ProductsHero from '@/components/products/ProductsHero';
import ProductsFilter from '@/components/products/ProductsFilter';
import ProductsGrid from '@/components/products/ProductsGrid';
import ProductsPagination from '@/components/products/ProductsPagination';
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const { 
    products, 
    loading, 
    error, 
    params, 
    updateFilters, 
    setPage 
  } = useProducts({
    page: 1,
    limit: 12
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* <ProductsHero /> */}
      
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <ProductsFilter 
            onFilterChange={updateFilters}
            currentFilters={params}
          />

          {/* Products Grid */}
          {error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : (
            <>
              <ProductsGrid 
                products={products} 
                loading={loading} 
              />

              {/* Pagination */}
              {!loading && products.length > 0 && (
                <ProductsPagination
                  currentPage={params.page}
                  totalItems={products.length}
                  itemsPerPage={params.limit}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;