import React from 'react';

const WhatTheBrandIs = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="order-2 md:order-1">
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Our Story</span>
              <div className="w-12 h-0.5 bg-emerald-600 mt-2"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 leading-tight">
              Crafted with intention,
              <br />
              <span className="font-semibold">distilled with care</span>
            </h2>
            
            <div className="space-y-4 text-stone-700 leading-relaxed">
              <p className="text-lg">
                essenceKRAFT was born from a simple belief: that nature holds the key to our wellbeing, and that the finest essential oils come from mindful sourcing and meticulous crafting.
              </p>
              
              <p>
                Every bottle we produce is a labor of love — small-batch distillations from botanicals sourced from sustainable farms around the world. We work directly with growers who share our commitment to purity and environmental stewardship.
              </p>
              
              <p>
                Our oils undergo rigorous GC-MS testing to ensure you receive nothing but the purest essence of each plant. No fillers, no synthetic fragrances, no compromises.
              </p>
              
              <p className="font-medium text-emerald-800">
                Because you deserve oils as authentic as the moments you create with them.
              </p>
            </div>

            {/* Key values */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="border-l-2 border-emerald-600 pl-4">
                <h3 className="font-semibold text-stone-900 mb-1">Purity First</h3>
                <p className="text-sm text-stone-600">100% pure botanical extracts with full transparency</p>
              </div>
              <div className="border-l-2 border-emerald-600 pl-4">
                <h3 className="font-semibold text-stone-900 mb-1">Sustainably Sourced</h3>
                <p className="text-sm text-stone-600">Ethical partnerships with responsible growers</p>
              </div>
              <div className="border-l-2 border-emerald-600 pl-4">
                <h3 className="font-semibold text-stone-900 mb-1">Small Batch</h3>
                <p className="text-sm text-stone-600">Handcrafted in limited quantities for quality</p>
              </div>
              <div className="border-l-2 border-emerald-600 pl-4">
                <h3 className="font-semibold text-stone-900 mb-1">GC-MS Tested</h3>
                <p className="text-sm text-stone-600">Every batch verified for purity and potency</p>
              </div>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="order-1 md:order-2">
            <div className="relative">
              {/* Main image container */}
              <div className="aspect-[3/4] bg-gradient-to-br from-emerald-100 to-stone-100 rounded-sm shadow-2xl overflow-hidden">
                {/* Replace this div with actual image */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 bg-emerald-200 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <p className="text-stone-600 text-sm">Brand Story Image</p>
                    <p className="text-stone-400 text-xs mt-2">Replace with actual product/brand photo</p>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-600 opacity-10 rounded-sm -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatTheBrandIs;