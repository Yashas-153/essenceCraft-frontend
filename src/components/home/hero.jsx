import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50 via-stone-50 to-stone-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-stone-900 mb-4">
            essence<span className="font-semibold">KRAFT</span>
          </h1>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-stone-700 max-w-4xl mx-auto mb-6 leading-relaxed font-light">
          Handcrafted, small-batch essential oils and botanical extracts for daily calm, focus and self-care.
        </p>

        <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          100% pure, responsibly sourced, GC–MS tested blends and single-note oils in 15 ml amber bottles.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg"
            onClick={() => scrollToSection('shop-bestsellers')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-6 text-lg rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Shop Bestsellers
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => scrollToSection('learn-about-oils')}
            className="border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white px-8 py-6 text-lg rounded-sm transition-all duration-300"
          >
            Learn About Oils
          </Button>
          <Button 
            size="lg" 
            variant="ghost"
            onClick={() => scrollToSection('wholesale-private-label')}
            className="text-stone-700 hover:text-emerald-700 px-8 py-6 text-lg transition-all duration-300"
          >
            Wholesale & Private Label
          </Button>
        </div>

        {/* Tagline */}
        <p className="text-sm md:text-base text-stone-500 italic font-light tracking-wide">
          Nature distilled — essenceKRAFT essential oils.
        </p>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-stone-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm">100% Pure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm">GC-MS Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm">Responsibly Sourced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm">Small Batch</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-stone-400 rounded-full flex justify-center">
          <div className="w-1.5 h-2 bg-stone-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;