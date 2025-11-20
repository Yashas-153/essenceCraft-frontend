import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Droplet, Leaf, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';

const STATIC_API_URL = process.env.REACT_API_STATIC_URL || 'http://localhost:8000';

const ProductShowcase = () => {
  const navigate = useNavigate();
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        setLoading(true);
        // Fetch products from API
        const response = await productsAPI.getAllProducts({ limit: 5 });
        
        // Pick a random product as featured
        if (response.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.length);
          setFeaturedProduct(response[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching featured product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  // Format price with currency symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-24 px-6 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-stone-200 rounded-sm animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-stone-200 rounded w-1/4 animate-pulse" />
              <div className="h-12 bg-stone-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-stone-200 rounded w-full animate-pulse" />
              <div className="h-6 bg-stone-200 rounded w-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProduct) {
    return null;
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-amber-50 via-emerald-50 to-stone-100 rounded-sm shadow-2xl overflow-hidden">
              {featuredProduct.image_url ? (
                <img 
                src={`${STATIC_API_URL}${featuredProduct.image_url}`} 
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* Decorative circles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border border-emerald-300 rounded-full opacity-30"></div>
                    <div className="w-48 h-48 border border-emerald-400 rounded-full opacity-40 absolute"></div>
                    <div className="w-32 h-32 border border-emerald-500 rounded-full opacity-50 absolute"></div>
                  </div>
                  
                  {/* Product bottle illustration */}
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-48 mx-auto mb-4 bg-amber-800 bg-opacity-80 rounded-sm flex items-center justify-center shadow-xl">
                      <Droplet className="w-12 h-12 text-amber-100" />
                    </div>
                    <div className="text-stone-600 text-sm font-medium">{featuredProduct.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 bg-white shadow-lg rounded-sm px-4 py-2 border border-emerald-100">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-stone-800">100% Pure</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-emerald-700 text-white shadow-lg rounded-sm px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">GC-MS Tested</span>
              </div>
            </div>
          </div>

          {/* CTA Content */}
          <div>
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Featured Product</span>
              <div className="w-12 h-0.5 bg-emerald-600 mt-2"></div>
            </div>

            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 leading-tight">
              <span className="font-semibold">{featuredProduct.name}</span>
            </h2>

            <p className="text-lg text-stone-700 mb-4 leading-relaxed">
              {featuredProduct.description || 'Experience the pure essence of nature with our premium essential oil collection.'}
            </p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-3xl font-bold text-emerald-700">{formatPrice(featuredProduct.price)}</span>
              {featuredProduct.stock_quantity > 0 && (
                <span className="ml-3 text-sm text-stone-500">
                  {featuredProduct.stock_quantity <= 5 ? `Only ${featuredProduct.stock_quantity} left in stock` : 'In Stock'}
                </span>
              )}
              {featuredProduct.stock_quantity === 0 && (
                <span className="ml-3 text-sm text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Product details */}
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">Premium Quality</h3>
                  <p className="text-stone-600 text-sm">Sourced from certified organic farms in Provence, France</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">Therapeutic Grade</h3>
                  <p className="text-stone-600 text-sm">Lab-tested purity with complete GC-MS analysis included</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">Sustainable Packaging</h3>
                  <p className="text-stone-600 text-sm">UV-protected amber glass with eco-friendly materials</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(`/products/${featuredProduct.id}`)}
                disabled={featuredProduct.stock_quantity === 0}
              >
                {featuredProduct.stock_quantity > 0 ? 'Shop This Product' : 'Out of Stock'}
                {featuredProduct.stock_quantity > 0 && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-stone-300 text-stone-700 hover:bg-stone-50 px-8 rounded-sm transition-all duration-300"
                onClick={() => navigate('/products')}
              >
                View All Products
              </Button>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-sm text-stone-500 italic">
              Join thousands who have discovered the essenceKRAFT difference
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;