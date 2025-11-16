import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = ({ 
  title = 'Ready to get started?',
  subtitle = 'Join us today',
  primaryButtonText = 'Get Started',
  primaryButtonLink = '#',
  secondaryButtonText,
  secondaryButtonLink = '#',
  backgroundColor = 'emerald',
  showPattern = true
}) => {
  const bgClasses = {
    emerald: 'bg-gradient-to-br from-emerald-700 to-emerald-800',
    stone: 'bg-gradient-to-br from-stone-700 to-stone-800',
    amber: 'bg-gradient-to-br from-amber-700 to-amber-800'
  };

  const bgClass = bgClasses[backgroundColor] || bgClasses.emerald;

  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className={`${bgClass} rounded-sm shadow-2xl overflow-hidden relative`}>
          {/* Background pattern */}
          {showPattern && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
            </div>
          )}

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 leading-tight">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg md:text-xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = primaryButtonLink}
                className="bg-white text-emerald-700 hover:bg-stone-50 px-8 py-6 text-lg rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {primaryButtonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {secondaryButtonText && (
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = secondaryButtonLink}
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-8 py-6 text-lg rounded-sm transition-all duration-300"
                >
                  {secondaryButtonText}
                </Button>
              )}
            </div>

            {/* Optional trust line */}
            <p className="mt-8 text-sm text-emerald-100 italic">
              Join thousands who trust essenceKRAFT for pure, sustainable essential oils
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;