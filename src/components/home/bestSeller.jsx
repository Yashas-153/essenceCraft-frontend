import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';

const STATIC_API_URL = process.env.REACT_APP_STATIC_URL || 'http://localhost:8000';

const ShopBestsellers = () => {
  const navigate = useNavigate();
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        // Fetch products from API
        const response = await productsAPI.getAllProducts({ limit: 12 });
        
        // Shuffle and pick 4 random products for bestsellers
        const shuffled = [...response].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        setBestsellers(selected);
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
        // Keep empty array on error
        setBestsellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  return (
    <section className="py-24 px-6 bg-white" id="shop-bestsellers">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Shop</span>
            <div className="w-12 h-0.5 bg-emerald-600 mt-2 mx-auto"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
            Our <span className="font-semibold">Bestsellers</span>
          </h2>
          
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Discover the essential oils our community loves most — each one crafted with care 
            and backed by countless five-star reviews.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {loading ? (
            // Loading skeleton
            [...Array(4)].map((_, index) => (
              <div key={index} className="bg-stone-50 rounded-sm border border-stone-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-stone-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-3 bg-stone-200 rounded w-1/4" />
                  <div className="h-8 bg-stone-200 rounded w-full" />
                </div>
              </div>
            ))
          ) : bestsellers.length > 0 ? (
            bestsellers.map((product) => {
              // Format price with currency symbol
              const formatPrice = (price) => {
                return new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(price);
              };

              return (
                <div 
                  key={product.id} 
                  className="bg-stone-50 rounded-sm border border-stone-200 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {/* Product image */}
                  <div className="relative aspect-square bg-gradient-to-br from-stone-100 to-emerald-50 overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={`${STATIC_API_URL}${product.image_url}`} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full ${product.image_url ? 'hidden' : 'flex'} items-center justify-center p-8`}
                      style={{ display: product.image_url ? 'none' : 'flex' }}
                    >
                      <div className="w-20 h-40 bg-amber-800 bg-opacity-70 rounded-sm shadow-lg"></div>
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-emerald-900 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    
                    {/* Stock badge */}
                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-sm">
                        Only {product.stock_quantity} left
                      </div>
                    )}
                    {product.stock_quantity === 0 && (
                      <div className="absolute top-3 right-3 bg-stone-700 text-white text-xs px-2 py-1 rounded-sm">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="p-6">
                    <h3 className="font-semibold text-stone-900 text-lg mb-1 leading-tight line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-500 mb-3 line-clamp-1">
                      {product.description || 'Pure Essential Oil'}
                    </p>

                    {/* Category/Tag */}
                    {product.category && (
                      <div className="mb-3">
                        <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-sm">
                          {product.category}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                      <div>
                        <span className="text-2xl font-semibold text-stone-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <button 
                        className="p-2 bg-emerald-700 text-white rounded-sm hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={product.stock_quantity === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to cart logic here
                        }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // No products message
            <div className="col-span-full text-center py-12">
              <p className="text-stone-500">No products available at the moment.</p>
            </div>
          )}
        </div>

        {/* View all CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate('/products')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-12 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopBestsellers;