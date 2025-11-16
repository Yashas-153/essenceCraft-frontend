import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopBestsellers = () => {
  const navigate = useNavigate();

  const bestsellers = [
    {
      id: 1,
      name: 'Lavender Essential Oil',
      origin: 'French Provence',
      price: '24.99',
      rating: 4.9,
      reviews: 248,
      image: null, // Replace with actual image URL
      benefits: ['Calm', 'Sleep', 'Relaxation']
    },
    {
      id: 2,
      name: 'Peppermint Essential Oil',
      origin: 'Oregon Grown',
      price: '19.99',
      rating: 4.8,
      reviews: 192,
      image: null,
      benefits: ['Focus', 'Energy', 'Clarity']
    },
    {
      id: 3,
      name: 'Eucalyptus Essential Oil',
      origin: 'Australian Blue Gum',
      price: '21.99',
      rating: 4.9,
      reviews: 156,
      image: null,
      benefits: ['Breathe', 'Refresh', 'Invigorate']
    },
    {
      id: 4,
      name: 'Tea Tree Essential Oil',
      origin: 'New Zealand',
      price: '22.99',
      rating: 4.7,
      reviews: 134,
      image: null,
      benefits: ['Purify', 'Cleanse', 'Protect']
    }
  ];

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
          {bestsellers.map((product) => (
            <div 
              key={product.id} 
              className="bg-stone-50 rounded-sm border border-stone-200 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Product image */}
              <div className="relative aspect-square bg-gradient-to-br from-stone-100 to-emerald-50">
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="w-20 h-40 bg-amber-800 bg-opacity-70 rounded-sm shadow-lg"></div>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-emerald-900 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Product details */}
              <div className="p-6">
                <h3 className="font-semibold text-stone-900 text-lg mb-1 leading-tight">
                  {product.name}
                </h3>
                <p className="text-sm text-stone-500 mb-3">{product.origin}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-stone-700 ml-1">{product.rating}</span>
                  </div>
                  <span className="text-xs text-stone-400">({product.reviews})</span>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.benefits.map((benefit, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-sm"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <div>
                    <span className="text-2xl font-semibold text-stone-900">${product.price}</span>
                    <span className="text-sm text-stone-500 ml-1">/ 15ml</span>
                  </div>
                  <button className="p-2 bg-emerald-700 text-white rounded-sm hover:bg-emerald-800 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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