import React from 'react';
import { Leaf, Heart, Users } from 'lucide-react';

const OurStory = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="order-2 md:order-1">
            <div className="relative">
              {/* Main image container */}
              <div className="aspect-[4/5] bg-gradient-to-br from-emerald-100 via-stone-100 to-amber-50 rounded-sm shadow-2xl overflow-hidden">
                {/* Replace with actual image */}
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-emerald-200 rounded-full flex items-center justify-center">
                      <Leaf className="w-16 h-16 text-emerald-700" />
                    </div>
                    <p className="text-stone-600 text-sm">Founder's Story Image</p>
                    <p className="text-stone-400 text-xs mt-2">Replace with team/founder photo</p>
                  </div>
                </div>
              </div>

              {/* Small decorative card */}
              <div className="absolute -bottom-8 -right-8 bg-white shadow-xl rounded-sm p-6 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-stone-900">Since 2020</span>
                </div>
                <p className="text-sm text-stone-600">Crafting pure essential oils with intention</p>
              </div>

              {/* Background decoration */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-600 opacity-10 rounded-sm -z-10"></div>
            </div>
          </div>

          {/* Text content */}
          <div className="order-1 md:order-2">
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Why We Exist</span>
              <div className="w-12 h-0.5 bg-emerald-600 mt-2"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 leading-tight">
              A gentler edge for
              <br />
              <span className="font-semibold">everyday life</span>
            </h2>
            
            <div className="space-y-4 text-stone-700 leading-relaxed">
              <p className="text-lg">
                In a world that moves too fast, we believe in slowing down to appreciate the simple, natural things that bring us back to ourselves.
              </p>
              
              <p>
                essenceKRAFT was born from personal experience — the discovery that pure, thoughtfully sourced aromatics could transform ordinary moments into opportunities for calm, focus, and self-care.
              </p>
              
              <p>
                What started as a passion project in a small workshop has grown into a commitment to bring authentic essential oils to homes and studios everywhere, without the fuss or the false promises.
              </p>
            </div>

            {/* Stats or highlights */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-semibold text-emerald-700 mb-1">100%</div>
                <div className="text-sm text-stone-600">Pure Oils</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-emerald-700 mb-1">5K+</div>
                <div className="text-sm text-stone-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-emerald-700 mb-1">50+</div>
                <div className="text-sm text-stone-600">Premium Oils</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;