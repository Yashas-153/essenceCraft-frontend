import React from 'react';
import { Droplet, TestTube, Leaf, Package } from 'lucide-react';

const ProductInfo = ({ product }) => {
  const features = [
    {
      icon: Droplet,
      title: '100% Pure',
      description: 'No additives or carrier oils'
    },
    {
      icon: TestTube,
      title: 'GC-MS Tested',
      description: 'Lab verified for quality'
    },
    {
      icon: Leaf,
      title: 'Sustainably Sourced',
      description: 'Ethically harvested botanicals'
    },
    {
      icon: Package,
      title: 'Amber Glass',
      description: 'UV-protected 15ml bottle'
    }
  ];

  return (
    <div className="border-t-2 border-stone-200 pt-8">
      <h3 className="text-lg font-semibold text-stone-900 mb-6">
        Product Features
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-4 bg-stone-50 rounded-sm border border-stone-100"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-emerald-700" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-stone-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;