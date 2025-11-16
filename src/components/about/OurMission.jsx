import React from 'react';
import { Sprout, TestTube, Package, Handshake } from 'lucide-react';

const OurMission = () => {
  const missionPoints = [
    {
      icon: Sprout,
      title: 'Sustainable Sourcing',
      description: 'We partner with growers who use sustainable harvest methods, ensuring the earth gives as much tomorrow as it does today.'
    },
    {
      icon: TestTube,
      title: 'Careful Distillation',
      description: 'Every batch is distilled with care, preserving the natural integrity and therapeutic properties of each botanical.'
    },
    {
      icon: Package,
      title: 'Protected Potency',
      description: 'Packaged in amber glass to shield your oils from light degradation, maintaining their full strength and aroma.'
    },
    {
      icon: Handshake,
      title: 'Small Batch Focus',
      description: 'Quality over quantity — every bottle is checked, labeled, and ready to lift your mood or steady your focus.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Our Mission</span>
            <div className="w-12 h-0.5 bg-emerald-600 mt-2 mx-auto"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
            Thoughtfully sourced,
            <br />
            <span className="font-semibold">lab-tested aromatics</span>
          </h2>
          
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
            We bring pure, tested essential oils to homes and studios — without the fuss. 
            Our commitment goes beyond the bottle to every step of the journey.
          </p>
        </div>

        {/* Mission grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {missionPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-white rounded-sm p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100"
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-sm flex items-center justify-center">
                    <point.icon className="w-8 h-8 text-emerald-700" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">
                    {point.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom statement */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-emerald-50 border border-emerald-100 rounded-sm p-8">
            <p className="text-lg text-stone-800 leading-relaxed">
              <span className="font-semibold text-emerald-800">Our promise is simple:</span> bring thoughtfully sourced, 
              lab-tested aromatics to your home — without compromising on quality, transparency, or sustainability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;