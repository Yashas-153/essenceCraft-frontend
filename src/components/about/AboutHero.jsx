import React from 'react';

const AboutHero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50 via-stone-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Breadcrumb */}
        <div className="mb-6">
          <span className="text-sm text-stone-500">Home / About Us</span>
        </div>

        {/* Main heading */}
        <div className="mb-6">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Our Story</span>
            <div className="w-12 h-0.5 bg-emerald-600 mt-2 mx-auto"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-stone-900 mb-6">
            About <span className="font-semibold">essenceKRAFT</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto leading-relaxed font-light">
          We started essenceKRAFT because everyday life needed a gentler edge.
        </p>

        {/* Decorative divider */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-16 h-0.5 bg-emerald-600"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
          <div className="w-16 h-0.5 bg-emerald-600"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;