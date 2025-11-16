import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Package, Users, Award, TrendingUp, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WholesalePrivateLabel = () => {
  const navigate = useNavigate();

  const benefits = [
    'Minimum order quantities tailored to your business',
    'Bulk pricing with volume discounts',
    'Private label and white label options',
    'Custom blending and formulation services',
    'Consistent quality and supply',
    'Dedicated account management'
  ];

  const solutions = [
    {
      icon: Package,
      title: 'Wholesale',
      description: 'Purchase our premium essential oils in bulk for your retail store, spa, or wellness center.',
      features: ['Competitive pricing', 'Flexible quantities', 'Fast fulfillment']
    },
    {
      icon: Users,
      title: 'Private Label',
      description: 'Launch your own essential oil brand with our high-quality products and custom packaging.',
      features: ['Your branding', 'Custom formulations', 'Full support']
    },
    {
      icon: Award,
      title: 'White Label',
      description: 'Rebrand our existing products with your logo and start selling immediately.',
      features: ['Quick to market', 'Proven formulas', 'No minimums']
    }
  ];

  return (
    <section className="py-24 px-6 bg-white"  id="wholesale-private-label">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Business Solutions</span>
            <div className="w-12 h-0.5 bg-emerald-600 mt-2 mx-auto"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
            Wholesale & <span className="font-semibold">Private Label</span>
          </h2>
          
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Partner with essenceKRAFT to bring premium essential oils to your customers. 
            We offer flexible wholesale and private label solutions for businesses of all sizes.
          </p>
        </div>

        {/* Solutions grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div 
              key={index}
              className="bg-stone-50 rounded-sm border border-stone-200 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-sm flex items-center justify-center mb-6">
                <solution.icon className="w-8 h-8 text-emerald-700" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-semibold text-stone-900 mb-3">
                {solution.title}
              </h3>
              <p className="text-stone-600 leading-relaxed mb-6">
                {solution.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-stone-700">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-700" strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Benefits section */}
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-sm p-12 text-white mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-light mb-4">
                Why Partner with <span className="font-semibold">essenceKRAFT</span>?
              </h3>
              <p className="text-emerald-100 text-lg">
                We're committed to helping your business succeed with premium products and exceptional service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-emerald-50">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-700 mb-2">500+</div>
            <p className="text-stone-600">Business Partners</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-700 mb-2">50+</div>
            <p className="text-stone-600">Countries Served</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-700 mb-2">100%</div>
            <p className="text-stone-600">Quality Guaranteed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-700 mb-2">24/7</div>
            <p className="text-stone-600">Support Available</p>
          </div>
        </div> */}

        {/* CTA */}
        {/* <div className="bg-stone-50 rounded-sm p-12 border border-stone-200 text-center">
          <TrendingUp className="w-16 h-16 text-emerald-700 mx-auto mb-6" />
          <h3 className="text-3xl font-light text-stone-900 mb-4">
            Ready to <span className="font-semibold">Grow Your Business</span>?
          </h3>
          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how essenceKRAFT can support your business goals. 
            Our team is ready to create a custom solution for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/wholesale/contact')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-12 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Request Wholesale Info
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/wholesale')}
              className="border-2 border-stone-300 hover:bg-stone-100 px-12 rounded-sm"
            >
              Learn More
            </Button>
          </div> */}

          {/* Contact info */}
          {/* <div className="mt-8 pt-8 border-t border-stone-200">
            <p className="text-sm text-stone-600 mb-2">
              Questions? Contact our wholesale team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="mailto:wholesale@essencekraft.com" className="text-emerald-700 hover:text-emerald-800 font-medium">
                wholesale@essencekraft.com
              </a>
              <span className="hidden sm:block text-stone-400">|</span>
              <a href="tel:+1234567890" className="text-emerald-700 hover:text-emerald-800 font-medium">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WholesalePrivateLabel;