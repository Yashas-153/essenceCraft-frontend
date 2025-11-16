import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-white rounded-sm shadow-md border border-stone-100 p-12 text-center">
          {/* Icon */}
          <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-stone-400" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">
            Your cart is <span className="font-semibold">empty</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-stone-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any essential oils to your cart yet. 
            Discover our pure, handcrafted collection.
          </p>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/products')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-6 text-lg rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Shop Essential Oils
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Features */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <p className="text-sm font-medium text-stone-700 mb-4">Why Choose essenceKRAFT?</p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-stone-600">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mb-2"></div>
                <span>100% Pure</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mb-2"></div>
                <span>GC-MS Tested</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mb-2"></div>
                <span>Sustainably Sourced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;