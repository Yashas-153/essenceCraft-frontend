import React from 'react';
import FeatureCard from '../common-components/FeatureCard';
import { Droplet, FileText, Recycle } from 'lucide-react';

const OurPromises = () => {
  const promises = [
    {
      icon: Droplet,
      title: 'Purity',
      subtitle: 'No compromises, ever',
      description: 'Single-source essential oils with no additives or carrier oils unless explicitly specified on the label.',
      features: [
        '100% pure botanical extracts',
        'No synthetic fragrances or fillers',
        'Clear labeling of all ingredients',
        'Batch-specific quality assurance'
      ],
      accentColor: 'emerald'
    },
    {
      icon: FileText,
      title: 'Transparency',
      subtitle: 'Complete clarity',
      description: 'We believe you deserve to know exactly what you\'re using. Every detail matters to us, and to you.',
      features: [
        'Full botanical names provided',
        'Extraction methods documented',
        'GC-MS testing available on request',
        'Sourcing information disclosed'
      ],
      accentColor: 'amber'
    },
    {
      icon: Recycle,
      title: 'Sustainability',
      subtitle: 'For today and tomorrow',
      description: 'Responsible sourcing and eco-conscious packaging ensure we leave the planet better than we found it.',
      features: [
        'Ethically sourced botanicals',
        'Sustainable harvest partnerships',
        'Recyclable amber glass bottles',
        'Minimal packaging waste'
      ],
      accentColor: 'green'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">What We Stand For</span>
            <div className="w-12 h-0.5 bg-emerald-600 mt-2 mx-auto"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
            Our <span className="font-semibold">Promises</span> to You
          </h2>
          
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Three pillars guide everything we do. These aren't just values — they're commitments 
            we honor with every bottle we craft.
          </p>
        </div>

        {/* Promises grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <FeatureCard
              key={index}
              icon={promise.icon}
              title={promise.title}
              subtitle={promise.subtitle}
              description={promise.description}
              features={promise.features}
              accentColor={promise.accentColor}
            />
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-stone-50 rounded-sm p-12 border border-emerald-100">
              <h3 className="text-3xl font-light text-stone-900 mb-4">
                Because you deserve <span className="font-semibold">authentic essential oils</span>
              </h3>
              <p className="text-lg text-stone-700 mb-6 max-w-2xl mx-auto">
                Every promise we make is backed by rigorous testing, ethical partnerships, 
                and an unwavering commitment to quality.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-700">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span>Certified pure by GC-MS testing</span>
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span>Trusted by thousands</span>
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPromises;