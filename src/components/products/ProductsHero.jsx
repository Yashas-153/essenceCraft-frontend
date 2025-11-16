import React from 'react';

const ProductsHero = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50 via-stone-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-20 w-48 h-48 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        {/* Breadcrumb */}
        <div className="mb-6">
          <span className="text-sm text-stone-500">Home / Products</span>
        </div>

        {/* Main heading */}
        <div className="mb-6">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Our Collection</span>
            <div className="w-12 h-0.5 bg-emerald-600 mt-2 mx-auto"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-stone-900 mb-6">
            Pure Essential <span className="font-semibold">Oils</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto leading-relaxed font-light">
          Discover our handcrafted collection of 100% pure, GC-MS tested essential oils and botanical blends.
        </p>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-stone-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm">Small Batch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm">Lab Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm">15ml Amber Bottles</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsHero;